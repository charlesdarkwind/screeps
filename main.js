const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
//const roleClaimer = require('role.claimer');
const roleRepairer = require('role.repairer');
const roleMiner = require('role.miner');
const roleCarrier = require('role.carrier');
const roleRemoteMiner = require('role.remoteMiner');
const roleRemoteCarrier = require('role.remoteCarrier');
const roleReserver = require('role.reserver');

const towers = require('towers');

module.exports.loop = function () {
    try {
        
        towers.run();
        Memory.underAttack = checkHostiles();
        
        function checkHostiles() {
            const hostiles = [];
            const rooms_ = [];
            
            for (const room_ in Game.rooms) {
                hostiles.push(...Game.rooms[room_].find(FIND_HOSTILE_CREEPS));
                if (hostiles.length) rooms_.push(room_.name);
            }
            if (hostiles.length > 0) {
                
                hostiles.sort((a,b) => {
                    const alpha = a.getActiveBodyparts(HEAL) + a.getActiveBodyparts(ATTACK) + a.getActiveBodyparts(RANGED_ATTACK);
                    const beta = b.getActiveBodyparts(HEAL) + b.getActiveBodyparts(ATTACK) + b.getActiveBodyparts(RANGED_ATTACK);
                    return beta - alpha;
                });
                
                const humanHostiles = hostiles.filter((ennemy) => ennemy.owner.username !== 'Invader' && (ennemy.getActiveBodyparts(ATTACK) + ennemy.getActiveBodyparts(RANGED_ATTACK) >= 4));
                const invaderNumber = hostiles.filter((ennemy) => ennemy.owner.username  == 'Invader');
                let numberToSpawn = humanHostiles.length + Math.floor(invaderNumber.length/2);
                
                if (rooms_.indexOf('W14S73') > -1 || rooms_.indexOf('W14S72') > -1) {
                    numberToSpawn++;
                    console.log(`Remote room under attack.`);
                }
                
                if (humanHostiles.length) Game.notify('Human hostile detected.');
                if (invaderNumber.length || humanHostiles.length) {
                    console.log(`humanHostiles: ${humanHostiles.length}, invaders: ${invaderNumber.length}, attackers to spawn: ${numberToSpawn}`);
                    return { hostiles, humanHostiles, numberToSpawn, rooms_ };
                } else {
                    delete Memory.underAttack2;
                    return null;
                }
            }          
        }

        // SPAWN 1
        const carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == 'W15S73');
        Memory.carriers = carriers;

        if(carriers.length < 2) {
            makeCreep(0,16,0,16,0,0,0,0, 'carrier', 'Spawn1');  
        } else if (carriers.length > 1 && carriers[0].ticksToLive > 40) { 

            // Under Attack
            const attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack');
            if (Memory.underAttack && attackers.length < Memory.underAttack.numberToSpawn) {
                makeCreep(5,7,0,0,2,0,0,0, 'attack', 'Spawn1'); 

            } else {   
                const miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
                if(miners.length < 2) {
                    makeCreep(0,1,5,0,0,0,0,0, 'miner', 'Spawn1');  
                } else {   
                    const builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' );
                    if(builder.length < Game.constructionSites ? 2 : 0 ) {
                        makeCreep(0,8,8,8,0,0,0,0, 'builder', 'Spawn1');    
                    } else {
                        const upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == 'W15S73');
                        if(upgrader.length < 2) {
                            makeCreep(0,3,13,2,0,0,0,0, 'upgrader', 'Spawn1');   
                        } else {                  
                            const claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer');
                            if(claimers.length < 0) {
                                makeCreep(0,1,0,0,0,0,0,1, 'claimer', 'Spawn1');   
                            } else {
                                const repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
                                if(repairers.length < 1) {
                                    makeCreep(0,8,8,8,0,0,0,0, 'repairer', 'Spawn1');   
                                } else {
                                    const remoteCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteCarrier');
                                    if(remoteCarriers.length < 4) {
                                        makeCreep(0,16,0,16,0,0,0,0, 'remoteCarrier', 'Spawn1');   
                                    } else {
                                        const twos = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner' && creep.memory.remoteMinerSpot == 'two');
                                        if(twos.length < 1) {
                                            makeCreep(0,3,5,0,0,0,0,0, 'remoteMiner', 'Spawn1', 'two');  
                                        } else {
                                            const reservers = _.filter(Game.creeps, (creep) => creep.memory.role == 'reserver');
                                            if(reservers.length < 1) {
                                                makeCreep(0,2,0,0,0,0,0,2, 'reserver', 'Spawn1');  
                                            } else {
                                                const fourths = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner' && creep.memory.remoteMinerSpot == 'four');
                                                if(fourths.length < 1) {
                                                    makeCreep(0,3,3,0,0,0,0,0, 'remoteMiner', 'Spawn1', 'four');  
                                                } else {
                                                    const ones = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner' && creep.memory.remoteMinerSpot == 'one');
                                                    if(ones.length < 1) {
                                                        makeCreep(0,3,5,0,0,0,0,0, 'remoteMiner', 'Spawn1', 'one');  
                                                    } 
                                                }
                                            }
                                        }
                                    }
                                }
                            }                      
                        }
                    }
                } 
            }
        } else if (carriers.length < 2 && carriers[0].ticksToLive < 40) {
            console.log(`Waiting for ${carriers[0]}\'s last 40 ticks`);   
        }
        
        // SPAWN 2
        const carriers2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier' && creep.room.name == 'W15S72');
        Memory.carriers2 = carriers2;

        if(carriers2.length < 2) {
            makeCreep(0,14,0,14,0,0,0,0, 'carrier', 'Spawn2');  
        } else if (carriers2.length > 1 && carriers2[0].ticksToLive > 40) {

            // Under Attack
            const attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attack');
            if (Memory.underAttack && attackers.length < Memory.underAttack.numberToSpawn) {
                makeCreep(5,7,0,0,2,0,0,0, 'attack', 'Spawn2'); 

            } else {
                const miners2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner2');
                if(miners2.length < 2) {
                    makeCreep(0,1,5,0,0,0,0,0, 'miner2', 'Spawn2');  
                } else {             
                    const repairers2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
                    if(repairers2.length < 0) {
                        makeCreep(0,8,8,8,0,0,0,0, 'repairer', 'Spawn2');  
                    } else {
                        const upgraders2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == 'W15S72');
                        if (upgraders2.length < 1) {
                            makeCreep(0,2,13,2,0,0,0,0, 'upgrader', 'Spawn2');
                        } else {
                            const builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
                            if(builder.length < 0 /*Game.constructionSites ? 2 : 0*/) {
                                makeCreep(0,8,8,8,0,0,0,0, 'builder', 'Spawn2');    
                            } else {
                                const remoteCarriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteCarrier');
                                if(remoteCarriers.length < 3) {
                                    makeCreep(0,18,0,18,0,0,0,0, 'remoteCarrier', 'Spawn2');   
                                } else {
                                    const threes = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteMiner' && creep.memory.remoteMinerSpot == 'three');
                                    if(threes.length < 1) {
                                        makeCreep(0,3,3,0,0,0,0,0, 'remoteMiner', 'Spawn2', 'three');  
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else if (carriers2.length < 2 && carriers2[0].ticksToLive < 40) {
            console.log(`Waiting for ${carriers[0]}\'s last 40 ticks`); 
        }


        // createCreep contructor
        function makeCreep(tough, move, work, carry, attack, rangedAttack, heal, claim, role, spawnName, remoteMinerSpot) {         
            const body = [];
            const partNames = [TOUGH, MOVE, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL, CLAIM];
            for (const arg in arguments) {
                if (arguments[arg]) {
                    for (let i = arguments[arg]; i > 0; i--) {
                        body.push(partNames[arg]);
                    }                   
                }
            }   
            const newName = Game.spawns[spawnName].createCreep(body, undefined, { role, remoteMinerSpot });
            console.log(`${spawnName} is spawning new ${role}: ${newName}.`);
        }
        
        
        for(const name in Game.creeps) {
            const creep = Game.creeps[name];
            switch(creep.memory.role) {
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break ;
                case 'upgrader2':
                    roleUpgrader.run(creep);
                    break ;
                case 'builder':
                    roleBuilder.run(creep);
                    break ;
                case 'miner':
                    roleMiner.run(creep, Game.rooms['W15S73'], 'miner');
                    break ;
                case 'miner2':
                    roleMiner.run(creep, Game.rooms['W15S72'], 'miner2');
                    break ;
                case 'remoteMiner':
                    roleRemoteMiner.run(creep);
                    break ;
                case 'remoteCarrier':
                    roleRemoteCarrier.run(creep);
                    break ;
                case 'carrier':
                    roleCarrier.run(creep);
                    break ;
                case 'claimer':
                    roleClaimer.run(creep);
                    break ;
                case 'reserver':
                    roleReserver.run(creep);
                    break ;
                case 'harvester_W15S72':
                    roleHarvester_W15S72.run(creep);
                    break ;
                 case 'repairer':
                     roleRepairer.run(creep);
                     break ;
                case 'repairer2':
                     roleRepairer.run(creep);
                     break ;
                  case 'attack':
                     roleAttack(creep);
                     break ;
            } 
        }
        
        function roleAttack(creep) {
            let target;
            if (Memory.underAttack) target = Memory.underAttack.hostiles[0];
            const structs = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: 'red', opacity: .3}});
                }
            } else if (structs) {
                if(creep.attack(structs) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structs);
                }
            }
        }
        
        // Links
        for (const room_ in Game.rooms) {
            if (Game.rooms[room_].controller.level >= 5) {
                
                const link1 = Game.rooms[room_].storage.pos.findClosestByRange(FIND_STRUCTURES, {
                   filter: (s) => s.structureType == STRUCTURE_LINK 
                });
                
                const link2 = Game.rooms[room_].controller.pos.findClosestByRange(FIND_STRUCTURES, {
                   filter: (s) => s.structureType == STRUCTURE_LINK 
                });
                
                if (link1 && link2) {
                    if (link2.energy <= 100) link1.transferEnergy(link2);
                }
            }
        }

        // Spawn
        for (const spawn_ in Game.spawns) {
            if(Game.spawns['Spawn1'].spawning) {
                const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
                Game.spawns['Spawn1'].room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    Game.spawns['Spawn1'].pos.x + 1,
                    Game.spawns['Spawn1'].pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
        
        // Memory garbage
        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }        
    } catch(err) {
        console.log(err.message);
    }
}