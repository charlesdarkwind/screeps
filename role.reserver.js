const roleReserver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            if (Game.rooms['W14S73']) {
                if(creep.reserveController(Game.rooms['W14S73'].controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms['W14S73'].controller, {visualizePathStyle: {stroke: '#blue', opacity: .3}}, {reusePath: 50});
                }
            } else {
                creep.moveTo(Game.flags.Flag4);
            }
        } catch(err) {
            console.log(creep.memory.role, err.message);
        }
        
    }
};

module.exports = roleReserver;