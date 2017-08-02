const towers = {
    run: function() {
        try {
            const towers = []
            for (const room in Game.rooms) {
                towers.push(...Game.rooms[room].find(FIND_STRUCTURES, {
                    filter: (structure) => structure.structureType == STRUCTURE_TOWER
                }));
            }

            towers.map(tower => {
                const closestHostile = tower.room.find(FIND_HOSTILE_CREEPS);
                closestHostile.sort((a,b) => {
                    const alpha = a.getActiveBodyparts(HEAL) + a.getActiveBodyparts(ATTACK) + a.getActiveBodyparts(RANGED_ATTACK);
                    const beta = b.getActiveBodyparts(HEAL) + b.getActiveBodyparts(ATTACK) + b.getActiveBodyparts(RANGED_ATTACK);
                    return beta - alpha;
                });

                const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => 
                    (structure.structureType == STRUCTURE_ROAD && structure.hits < 4500) ||

                    (structure.structureType == STRUCTURE_RAMPART && structure.hits < 350000) ||

                    (structure.structureType == STRUCTURE_WALL && structure.hits < 350000 &&
                    (structure.pos.x != 10 && structure.pos.y > 10)) ||

                    (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)
                });  


                if(closestHostile.length) {
                    tower.attack(closestHostile[0]);
                } else if (closestDamagedStructure && tower.energy > 500) {
                    tower.repair(closestDamagedStructure);
                }
            });
        } catch(err) {
            console.log(err.message)
        }
    }
}

module.exports = towers;