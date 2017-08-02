const roleMiner = {
    run: function(creep, room_, role_) {
        try {

                const miners = _.filter(Game.creeps, (creep) => creep.memory.role == role_);       

                const sourceMap = {
                    W15S72: 0,
                    W15S73: 1
                };
                let source = sourceMap[room_.name];                    
                const sources = creep.room.find(FIND_SOURCES);

                if (creep == miners[0]) {               
                    source = room_.name == 'W15S73' ? 0 : 1;
                                
                 // Miner[1] W15S73
                } else if (creep.room.name == 'W15S73' && (creep.pos.x != 25 || creep.pos.y != 10)) {
                    creep.moveTo(25,10);

                 // Miner[1] W15S72
                } else if (creep.room.name == 'W15S72' && (creep.pos.x != 29 || creep.pos.x != 13)) {
                    creep.moveTo(29,13);
                }                
                if(creep.harvest(sources[source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[source], {visualizePathStyle: {stroke: '#ffaa00'}}, {reusePath: 50});
                }       

            
        } catch(err) {
            console.log(err, creep.memory.role);
        }
    }
};

module.exports = roleMiner;