const roleRemoteMiner = {
    run: function(creep, room_, role_) {
        try {
            const { remoteMinerSpot } = creep.memory;
            
            if (remoteMinerSpot == 'one') {
                if (creep.room.name != 'W14S73') {
                    creep.moveTo(Game.flags.Flag2, {visualizePathStyle: {stroke: 'black'}}, {reusePath: 50});
                } else {
                    const sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[1], {visualizePathStyle: {stroke: 'black'}}, {reusePath: 50});
                    }
                }
            } else if (remoteMinerSpot == 'two') {
                if (creep.room.name != 'W14S73') {
                    creep.moveTo(Game.flags.Flag4, {visualizePathStyle: {stroke: 'black'}}, {reusePath: 50});
                } else {
                    const sources = creep.room.find(FIND_SOURCES);
                    if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(sources[0], {visualizePathStyle: {stroke: 'black'}}, {reusePath: 50});
                    }
                }
            } else if (remoteMinerSpot == 'three') {
                if (creep.room.name != 'W14S72') {
                    creep.moveTo(Game.flags.Flag5, {visualizePathStyle: {stroke: 'black'}}, {reusePath: 100});
                } else {
                    if (creep.pos.x != 21 && creep.pos.x != 37) {
                        creep.moveTo(21,37);
                    } else {
                        const sources = creep.room.find(FIND_SOURCES);
                        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[0], {visualizePathStyle: {stroke: 'black'}}, {reusePath: 50});
                        }
                    }
                }
            } else if (remoteMinerSpot == 'four') {
                if (creep.room.name != 'W14S72') {
                    creep.moveTo(Game.flags.Flag5, {visualizePathStyle: {stroke: 'black'}}, {reusePath: 100});
                } else {
                    if (creep.pos.x != 19 && creep.pos.x != 45) {
                        creep.moveTo(19,45);
                    } else {
                        const sources = creep.room.find(FIND_SOURCES);
                        if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(sources[1], {visualizePathStyle: {stroke: 'black'}}, {reusePath: 60});
                        }
                    }
                }
            }

        } catch(err) {
            console.log(err, creep.memory.role);
        }
    }
};

module.exports = roleRemoteMiner;