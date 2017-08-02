const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }
            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }
            const upgradeCont = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_CONTAINER
            });
    
            if(creep.memory.building) {

                // If standing on edges of map
                if (creep.pos.y == 49)  {
                    creep.move(TOP);
                } else if(creep.pos.x == 0)  {
                    creep.move(RIGHT);
                }

                const targets = Object.keys(Game.constructionSites);

                if(targets.length) {
                    if(creep.build(Game.getObjectById(targets[0])) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(targets[0]), {visualizePathStyle: {stroke: 'green', opacity: .4 }}, {reusePath: 50});
                    }
                }
            } else {
                let containers = [];
                
                containers.push(...Game.rooms['W15S73'].find(FIND_STRUCTURES, {
                    filter: (cont) =>   cont.structureType == STRUCTURE_CONTAINER &&
                                        cont.store.energy >= creep.carryCapacity &&
                                        cont != upgradeCont
                }));
                //containers = _.sortBy(containers, s => creep.pos.getRangeTo(s));
                containers.sort((a,b) => b.store.energy - a.store.energy);
                
                if (containers.length) {
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: 'black'}})
                    }
                } else {
                    const storage = creep.room.storage || Game.rooms['W15S73'].storage;
                    if (storage) {
                        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage, {visualizePathStyle: {stroke: 'blue', opacity: .2 }}, {reusePath: 50});
                        } 
                    }
                }         
            }          
        } catch(err) {
            console.log(err, creep.memory.role);
        }
    }
};

module.exports = roleBuilder;