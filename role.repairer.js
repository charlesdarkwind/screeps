const roleRepairer = {
    run: function(creep) {
        try {
            
            if(creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
                creep.say('🚧 repair');
            }

            const hitValues = {
                rampart: 350000, constructedWall: 350000, road: 5000, container: 250000 
            };

            // Be repairing.
            if(creep.memory.repairing) {    
                const closestDamagedStructure = [];
                for (const room_ in Game.rooms) {                       
                        closestDamagedStructure.push(...Game.rooms[room_].find(FIND_STRUCTURES, {
                            filter: (structure) => 

                            (structure.room.name != 'W14S72' && structure.structureType == STRUCTURE_WALL && structure.hits < hitValues.constructedWall &&
                            (structure.pos.x != 10 && structure.pos.y > 10)) ||

                            (structure.structureType == STRUCTURE_CONTAINER && structure.hits < hitValues.container) ||

                            (structure.structureType == STRUCTURE_RAMPART && structure.hits < hitValues.rampart) ||

                            (structure.structureType == STRUCTURE_ROAD && structure.hits < hitValues.road)   
                        }));
                }
    
                /*closestDamagedStructure.unshift(...Game.rooms['W15S73'].find(FIND_STRUCTURES, {
                    filter: (structure) => 
                    (structure.structureType == STRUCTURE_RAMPART && structure.hits == 1)
                }));*/
                closestDamagedStructure.sort((a,b) => (a.hits/hitValues[a.structureType]*100) - (b.hits/hitValues[b.structureType]*100));

                // If standing on edges of map
                if (creep.pos.y == 49)  {
                    creep.move(TOP);
                } else if(creep.pos.x == 0)  {
                    creep.move(RIGHT);
                }

                // Save current lowest hits structure in cold memory.               
                let struct = closestDamagedStructure[0];
                const currentObj = Game.getObjectById(creep.memory.current);
                if (!currentObj) creep.memory.current = struct.id;               

                // Keep it in memory and keep repairing it until reaching associated hitValue.              
                currentObj.hits < hitValues[currentObj.structureType] ? struct = currentObj : creep.memory.current = struct.id;
                if (struct) {
                        if(creep.repair(struct) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(struct, {visualizePathStyle: {stroke: 'green', opacity: .4}}, {reusePath: 50});
                    }   
                }

            // Aquire energy.
            } else {
                
                // Dropped energy.
                const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (resource) =>   resource.amount > 100 && 
                                            ((resource.pos.x - creep.pos.x <= 3 && resource.pos.x - creep.pos.x >= -3) && 
                                            (resource.pos.y - creep.pos.y <= 3 && resource.pos.y - creep.pos.y >= -3))
                }); 
                if ((!creep.memory.repairing && droppedEnergy.length > 0) || (creep.carry.energy + droppedEnergy.amount <= creep.carryCapacity)) {
                    creep.say('Dropped');
                    if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: 'blue', opacity: .3}});
                        if (creep.carry.energy > 160) creep.memory.repairing = true;
                    } 
                    
                
                } else {
                    const containers = creep.room.find(FIND_STRUCTURES, {
                       filter: (s) =>   s.structureType == STRUCTURE_CONTAINER &&
                                        s.store.energy >= creep.energyCapacity
                    });
                    containers.sort((a,b) => b.store.energy - a.store.energy);
                    
                    if (containers.length) {
                        if(creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        } 
                    } else {
                        // Withdraw from Storage
                        const storage = creep.room.storage || Game.rooms['W15S73'].storage;
                        if (storage) {
                            if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                            } 
                        } 
                    }
                }
            }
        } catch(err) {
            console.log(err, creep.memory.role);
        }
    }
};

module.exports = roleRepairer;