const remoteCarrier = {
    run: function(creep) {
        try {

            if(creep.memory.transfering && creep.carry.energy < 50) {
                creep.memory.transfering = false;
                creep.say('👌 harvest');
            }
            if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
                creep.memory.transfering = true;
                creep.say('🚧  fill');
            }  

            // DEPOSIT
            if (creep.memory.transfering) {     
                    const upgradeCont = Game.getObjectById('5978d9c55b9a6c362560a7b0');
                    if (upgradeCont && upgradeCont.store.energy <= upgradeCont.storeCapacity - (creep.carryCapacity + 100)) {
                        if(creep.transfer(upgradeCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgradeCont, {visualizePathStyle: {stroke: 'blue', opacity: .2 }}, {reusePath: 50});
                        } 
                    } else {
                        const storage = Game.rooms['W15S72'].storage;
                        if (storage) {
                            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(storage, {visualizePathStyle: {stroke: 'blue', opacity: .2 }}, {reusePath: 50});
                            } 
                        } 
                    }
    
            // AQUIRE ENERGY
            } else {        

                // DROPPED ENERGY   
                const droppedEnergy = [];
                for (const room_ in Game.rooms) {
                    droppedEnergy.push(...Game.rooms[room_].find(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => resource.amount >= 500
                    }));
                }
                droppedEnergy.sort((a,b) => b.amount - a.amount);      
                
                if (droppedEnergy.length) {
                    if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: 'blue', opacity: .2}}, {reusePath: 20});
                    }

                // WITHDRAW
                } else {   
                    
                    const droppedEnergyNear = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (resource) =>   resource.amount > 230 &&
                                                ((resource.pos.x - creep.pos.x <= 3 && resource.pos.x - creep.pos.x >= -3) && 
                                                (resource.pos.y - creep.pos.y <= 3 && resource.pos.y - creep.pos.y >= -3))
                    });
                    
                    // DROPPED ENERGY
                    if (droppedEnergyNear.length) {
                        
                        creep.say('Dropped');
                        if (creep.pickup(droppedEnergyNear[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedEnergyNear[0], {visualizePathStyle: {stroke: 'blue', opacity: .2}});
                        }
    
                    // WITHDRAW
                    } else {
                        const remoteRooms = ['W14S73', 'W14S72'];
                        const containers = [];
                        remoteRooms.map(room_ => {
                            containers.push(...Game.rooms[room_].find(FIND_STRUCTURES, {
                                filter: (cont) =>   cont.structureType == STRUCTURE_CONTAINER &&
                                                    cont.store.energy >= 400
                                }));
                        });
                        containers.sort((a,b) => b.store.energy - a.store.energy);
                        
                        if (containers.length) {
                            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}}, {reusePath: 50})
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

module.exports = remoteCarrier;