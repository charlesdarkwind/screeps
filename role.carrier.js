const roleCarrier = {
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

            const carriers = Memory.carriers;
            const carriers2 = Memory.carriers2;
            const upgradeCont = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) =>  s.structureType == STRUCTURE_CONTAINER
            });
            
            // REFILL
            if (creep.memory.transfering) {
                const targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return  (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity) ||
                                    (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity) || 
                                    (structure.structureType == STRUCTURE_TOWER && structure.energy < 500)
                        }
                });

                const towers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                            return  (structure.structureType == STRUCTURE_TOWER && structure.energy < 700)
                        }
                });  
                
                const link = creep.room.storage.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (link) =>   link.structureType == STRUCTURE_LINK
                });
                
                if(targets.length) {       
                    if (creep == carriers[1] || creep == carriers2[1]) targets.reverse();             
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    }            
                } else if (towers.length && (creep == carriers[1] || creep == carriers2[1])) {
                    if(creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(towers[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    } 
                } else if (link && !link.energy) {
                    if(creep.transfer(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    } 
                    
                } else if (upgradeCont && !Memory.underAttack && upgradeCont.store.energy <= upgradeCont.storeCapacity - (creep.carryCapacity + 100)) {
                    if (upgradeCont .store.energy < 1600) {
                        if (creep.carry.energy < 400) creep.memory.transfering = false
                        if(creep.transfer(upgradeCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgradeCont, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        } 
                    }
                } else {
                    const storage = creep.room.storage;
                    if (storage) {
                        if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        } 
                    }
                }
                
                
            // AQUIRE ENERGY
            } else {           
                const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                    filter: (resource) =>   (resource.amount > 230 &&
                                            ((resource.pos.x - creep.pos.x <= 3 && resource.pos.x - creep.pos.x >= -3) && 
                                            (resource.pos.y - creep.pos.y <= 3 && resource.pos.y - creep.pos.y >= -3)))
                });
                
                // DROPPED ENERGY
                if (droppedEnergy.length && !Memory.underAttack) {
                    creep.say('Dropped');
                    if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: 'blue', opacity: .2}});
                    }

                // WITHDRAW
                } else {        
                    let containers = creep.room.find(FIND_STRUCTURES, {
                        filter: (cont) =>   cont.structureType == STRUCTURE_CONTAINER &&
                                            cont.store.energy >= creep.carryCapacity &&
                                            cont.pos != upgradeCont.pos
                    });       
                    //if (containers.indexOf(upgradeCont) > -1) containers = containers.slice(containers.indexOf(upgradeCont), 1);
                    
                    containers.sort((a,b) => b.store.energy - a.store.energy);
                    //console.log(containers)
                    if (containers.length) {
                        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}})
                        }
                    } else {
                        const storage = creep.room.storage;
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

module.exports = roleCarrier;