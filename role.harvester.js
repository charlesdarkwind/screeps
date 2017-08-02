const roleHarvester = {
    run: function(creep, room_, role_) {
        try {
            
            if(creep.memory.transfering && creep.carry.energy == 0) {
                creep.memory.transfering = false;
                creep.say('👌 harvest');
            }
            if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
                creep.memory.transfering = true;
                creep.say('🚧  fill');
            }  

            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role_);

            // REFILL
            if (creep.memory.transfering) {
                const targets = room_.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return  (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) ||
                                    (structure.structureType == STRUCTURE_TOWER && structure.energy < 300)
                        }
                });
                const sites = room_.find(FIND_CONSTRUCTION_SITES);
                const towers = room_.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                            return  (structure.structureType == STRUCTURE_TOWER && structure.energy < 500)
                        }
                });
                
                if (towers.length && creep == harvesters[harvesters.length-1]) {
                    if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }
                } else if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }
                } else if (towers.length) {
                    if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }
                } else if (sites.length) {
                    if(creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sites[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }
                } else {
                    if(creep.upgradeController(room_.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(room_.controller, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }
                }
                
            // HARVEST
            } else {
                
            // DROPPED ENERGY
                const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (resource) => resource.amount > 75 /*&&
                                          (resource.pos.x - creep.pos.x <= 3 && resource.pos.y - creep.pos.y <= 3)*/
                });
                if (!creep.memory.transfering && droppedEnergy.length > 0) {
                    creep.say('Dropped');
                    if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: 'blue', opacity: .2}});
                    }
                } else {

                    // HARVEST SOURCES                  
                    const containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (cont) =>   cont.structureType == STRUCTURE_CONTAINER &&
                                            cont.store.energy >= 200
                    });
                    containers.sort((a,b) => b.store.energy - a.store.energy);

                    if (containers.length ) {
                        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    } else {
                        const sourceMap = {
                            W15S72: 0,
                            W15S73: 1
                        };
                        let source = sourceMap[room_.name];                    

                        if (creep == harvesters[0]) source = room_.name == 'W15S73' ? 1 : 1;

                        const sources = creep.room.find(FIND_SOURCES);
                        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }            
        } catch(err) {
            console.log(err, creep.memory.role);
        }
    }
};

module.exports = roleHarvester;