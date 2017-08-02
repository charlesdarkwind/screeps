const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
              }
              if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                  creep.memory.upgrading = true;
                  creep.say('⚡ upgrade');
              }
        
            if(creep.memory.upgrading) {

            // SIGN
                if (creep.room.controller.sign.username != 'charlesdankwin') {
                    if (creep.room.controller) {
                        if (creep.signController(creep.room.controller, "Interior crocodile alligator, I drive a chevrolet movie theater. 👌")) {
                            creep.moveTo(creep.room.controller, {reusePath: 50});
                        }
                    }
                }

            // UPGRADE
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: 'blue', opacity: .2 }}, {reusePath: 50});
                }
                
            } else {
                const pos = new RoomPosition(12, 32, 'W15S73');
                if (creep.room.name == 'W15S73' && creep.pos != pos ) creep.moveTo(pos);
                
                const link = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_LINK 
                });
                if (link && link.energy >= creep.carryCapacity) {
                    if(creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(link, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                    } 
                } else {
                    const upgradeCont = creep.room.controller.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.structureType == STRUCTURE_CONTAINER
                    });
                    if (upgradeCont) {
                        if(creep.withdraw(upgradeCont, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(upgradeCont, {visualizePathStyle: {stroke: 'blue', opacity: .2 }});
                        } 
                    } 
                }
            }
        } catch(err) {
            console.log(err, creep.memory.role);
        }
  }
};

module.exports = roleUpgrader;