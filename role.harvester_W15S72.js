const roleHarvester_W15S72 = {
    run: function(creep) {
        try {
            if (creep.room.name != 'W15S72') {
                creep.moveTo(Game.rooms['W15S72'].controller, {visualizePathStyle: {stroke: 'black', opacity: .2 }});
                return;
            } else {
                if(creep.memory.transfering && creep.carry.energy == 0) {
                    creep.memory.transfering = false;
                    creep.say('👌 harvest');
                }
                if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.transfering = true;
                    creep.say('🚧  fill');
                } 
            
            
                // REFILL
                if (creep.memory.transfering) {
                    const targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;
                            }
                    });
                    
                    //const sites = Game.rooms['W15S73'].find(FIND_CONSTRUCTION_SITES).concat(Game.rooms['W15S72'].find(FIND_CONSTRUCTION_SITES));
                    const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                    
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        }
                    } else if (sites.length) {
                        if(creep.build(sites[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sites[0], {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        }
                    } else {
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        }
                    }
                    
                // HARVEST
                } else {
                    
                    // DROPPED ENERGY
                    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: (resource) => resource.amount > 12 &&
                                              (resource.pos.x - creep.pos.x <= 3 && resource.pos.y - creep.pos.y <= 3)
                    });
                    if (!creep.memory.transfering && droppedEnergy.length > 0) {
                        creep.say('Dropped');
                        if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: 'blue', opacity: .2}});
                            if (creep.carry.energy > 160) creep.memory.upgrading = true;
                        }
                    } else {
                        
                        // HARVEST SOURCES
                        let source = 0;
                        // const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
                        // if (creep == harvesters[0]) source = 0;
                        const sources = creep.room.find(FIND_SOURCES);
                        if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[source], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
            
            
        } catch(err) {
            console.log(err);
        }
  }
};

module.exports = roleHarvester_W15S72;