const roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            if (creep.room.name != Game.flags.Flag1.room.name) {
                creep.moveTo(Game.flags.Flag1)
            } else if (creep.room.controller) {
                if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {reusePath: 50});
                }
            }
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = roleClaimer;