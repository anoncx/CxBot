const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals} = require('mineflayer-pathfinder')
const { stdin: input, stdout: output } = require('node:process');
const { GoalNear } = require('mineflayer-pathfinder').goals
const readline = require('node:readline');
var AutoAuth = require('mineflayer-auto-auth')
const movement = require("mineflayer-movement")
const inventoryViewer = require('mineflayer-web-inventory')
const autoeat = require('mineflayer-auto-eat').plugin
const armorManager = require('mineflayer-armor-manager')
const pvp = require('mineflayer-pvp').plugin


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

moveMode = false
var FollowModeVar
var followMode
var pvpMode

function mainLoop() {
    console.clear()
    const bot = mineflayer.createBot({
        host: 'Alacity.net',
        username: 'CxBot',
        plugins: [AutoAuth],
        AutoAuth: 'CxBotOnTop'
    })

    bot.loadPlugin(pathfinder)
    bot.loadPlugin(movement.plugin)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)

    function reset() {
        antiAfk = false
        followMode = false
        bot.pathfinder.setGoal(null)
        bot.pvp.stop()
        bot.setControlState("forward", false)
        bot.setControlState("sprint", false)
        bot.setControlState("jump", false)
    }

    bot.once('spawn', () => {inventoryViewer(bot)})

    bot.on('spawn', () => {
        console.log(`[Project Cx] >>>  Joined Server as [${bot.username}] successfully!`)
        console.log(`[Project Cx] >>>  You May Now Give Commands!`)
        console.log("")
        const { Default } = bot.movement.goals
        const defaultMove = new Movements(bot)
        bot.movement.setGoal(Default)


        bot.on('whisper', function(username, message) {
            const target = bot.players[username] ? bot.players[username].entity : null
            if (username === 'Cxiy' || 'AlmasWarlord' || 'zxham') {
                if (message === 'cx.cords') {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Cords`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                    bot.chat(`/msg ${username} My Cords Are ${bot.entity.position}`)
                } else if (message === "cx.quit") {
                    followMode = false
                    antiAfk = false
                    moveMode = false
                    console.clear()
                    bot.quit()
                    console.log(`[Project Cx] >>>  Bot Successfully Logged Out due Override From [${username}]`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                    process.exit(1);
                } else if (message === 'cx.come') {
                    followMode = false
                    antiAfk = false
                    console.clear()
                    reset()
                    if (!target) {
                        bot.chat(`/msg ${username} Your Not In My Render Distance`)
                        console.log(`[Project Cx] >>>  [Override From ${username}] Requested To Follow Failed [Player Out Of Reach]`)
                        console.log("")
                      return
                    }
                    const p = target.position

                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested To Follow Him`)
                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 0))
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                }  else if (message == "cx.anti-afk") {
                    followMode = false
                    reset()
                    moveMode = false
                    antiAfk = true
                    bot.setControlState("forward", true)
                    bot.setControlState("sprint", true)
                    bot.setControlState("jump", true)
                    console.clear()
                    const entity = bot.entity
                    bot.movement.heuristic.get('proximity')
                                .target(entity.position)
                    bot.on("physicsTick", function tick() {
                        if (antiAfk == true) {
                            if (entity) {
                                const yaw = bot.movement.getYaw(240, 15, 1)
                                bot.movement.steer(yaw)
                            }
                        }
                    })
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested AFK Mode`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.stop") {
                    followMode = false
                    antiAfk = false
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Froce Stop`)
                    bot.pathfinder.setGoal(null)
                    bot.setControlState("forward", false)
                    bot.setControlState("sprint", false)
                    bot.setControlState("jump", false)

                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.follow") {
                    reset()
                    console.clear()
                    if (FollowModeVar == true) {
                        FollowModeVar = false
                        console.log(`[Project Cx] >>>  [Override From ${username}] Set Follow Mode To [${String(FollowModeVar)}]`)
                        bot.chat(`/msg ${username} Now Stopped Following You`)
                    } else {
                        FollowModeVar = true
                        console.log(`[Project Cx] >>>  [Override From ${username}] Set Follow Mode To [${String(FollowModeVar)}]`)
                        bot.chat(`/msg ${username} Now Following You`)
                    }
                    followMode = true
                    antiAfk = false
                    const entity = bot.players[username] ? bot.players[username].entity : null
                    var test = 0;
                    bot.on('physicsTick', () => {
                        if (entity) {
                            test++;
                            if (test == 20 && followMode == true && FollowModeVar == true) {
                                const p = entity.position
                                bot.pathfinder.setMovements(defaultMove)
                                bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
                                test = 0;
                            }
                        }
                    })
    
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.suicide") {
                    bot.chat(`/msg ${username} Okay Killing Myself Now`)
                    bot.chat('/kill')
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Commit Suicide`)
                    console.log(`[Project Cx] >>>  Bot Killed Himself`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.mount") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Mount Nearest Entity`)
                    entity = bot.nearestEntity((entity) => { return entity.name === 'boat' })
                    if (entity) {
                        bot.mount(entity)
                        console.log(`[Project Cx] >>>  Success Bot Mounted Entity`)
                    } else {
                        bot.chat(`/msg ${username} No Objects To Mount`)
                        console.log(`[Project Cx] >>>  Failed > No Entity To Mount Nearby`)
                    }
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.dismount") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Dismount Entity`)
                    bot.dismount()
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")

                } else if (message == "cx.tpaccept") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Type /tpaccept`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                    bot.chat(`/tpaccept ${username}`)
                } else if (message == "cx.tpa") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Type /tpa ${username}`)
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                    bot.chat(`/tpa ${username}`)
                } else if (message == "cx.sleep") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Sleep`)
                    const bed = bot.findBlock({
                        matching: block => bot.isABed(block)
                    })

                    if (bed) {
                        try {
                          bot.sleep(bed)
                          bot.chat(`/msg ${username} Sleeping...`)
                          console.log(`[Project Cx] >>>  [Override From ${username}] Bot Sleeping`)
                        } catch (err) {
                          bot.chat(`/msg ${username} I can't sleep: ${err.message}`)
                          console.log(`[Project Cx] >>>  [Override From ${username}] Failed To Sleep > [${err.message}]`)
                        }
                    } else {
                        console.log(`[Project Cx] >>>  [Override From ${username}] Failed To Sleep > No Bed In Reach`)
                    }
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                } else if (message == "cx.wake") {
                    console.clear()
                    console.log(`[Project Cx] >>>  [Override From ${username}] Requested Bot To Wake Up`)
                    try {
                        bot.wake()
                        bot.chat(`/msg ${username} Woke Up`)
                        console.log(`[Project Cx] >>>  [Override From ${username}] Bot Woke Up`)
                    } catch (err) {
                        bot.chat(`/msg ${username} I can't WakeUp > ${err.message}`)
                        console.log(`[Project Cx] >>>  [Override From ${username}] Failed To WakeUp > [${err.message}]`)
                    }
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                }
            }
        })

        rl.on('line', (input) => {
        
            if (input == "relog") {
                followMode = false
                antiAfk = false
                reset()
                moveMode = false
                console.clear()
                bot.quit()
                console.log(`[Project Cx] >>>  Bot Left Successfully!`)
                console.log("")
                setTimeout(mainLoop, 3000);

            }   else if (input == "quit") {
                followMode = false
                antiAfk = false
                moveMode = false
                console.clear()
                bot.quit()
                console.log("[Project Cx] >>>  Bot Successfully Logged Out!")
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
                process.exit(1);

            } else if (input == "move") {
                followMode = false
                antiAfk = false
                reset()
                moveMode = true
                console.clear()
                console.log("[Project Cx] >>>  To What Coordinates Should I Travel?")
                console.log("[Project Cx] >>>  Please Type X Cord Then Press Enter, Then Y Cord [Enter] and so On")
                bot.pathfinder.setMovements(defaultMove)
                bot.pathfinder.setGoal(new GoalNear(-994, 74, -5, 0))

            } else if (input == "cords") {
                console.clear()
                console.log(`[Project Cx] >>>  Bot Cords Are ${bot.entity.position}`)
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
            } else if (input == "anti afk") {
                followMode = false
                reset()
                moveMode = false
                antiAfk = true
                bot.setControlState("forward", true)
                bot.setControlState("sprint", true)
                bot.setControlState("jump", true)
                console.clear()
                const entity = bot.entity
                bot.movement.heuristic.get('proximity')
                            .target(entity.position)
                bot.on("physicsTick", function tick() {
                    if (antiAfk == true) {
                        if (entity) {
                            const yaw = bot.movement.getYaw(240, 15, 1)
                            bot.movement.steer(yaw)
                        }
                    }
                })
                console.log("[Project Cx] >>>  Bots Anti AFK Mode Active")
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
            } else if (input == "stop") {
                followMode = false
                antiAfk = false
                console.clear()
                bot.pathfinder.setGoal(null)
                bot.setControlState("forward", false)
                bot.setControlState("sprint", false)
                bot.setControlState("jump", false)
                console.log(`[Project Cx] >>>  Bot Forced Stop`)
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
            } else if (input == "follow") {
                reset()
                console.clear()
                if (FollowModeVar == true) {
                    FollowModeVar = false
                    console.log(`Set Follow Mode To [${String(FollowModeVar)}]`)
                } else {
                    FollowModeVar = true
                    console.log(`Set Follow Mode To [${String(FollowModeVar)}]`)
                }
                followMode = true
                antiAfk = false
                const entity = bot.nearestEntity(entity => entity.type === "player")
                var test = 0;
                bot.on('physicsTick', () => {
                    if (entity) {
                        test++;
                        if (test == 20 && followMode == true && FollowModeVar == true) {
                            const p = entity.position
                            bot.pathfinder.setMovements(defaultMove)
                            bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
                            test = 0;
                        }
                    }
                })

                console.log(`[Project Cx] >>>  Follow Command Toggled By Console > Now Following [${entity.username}]`)
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
                
            } else if (input == "suicide") {
                bot.chat('/kill')
                console.log(`[Project Cx] >>>  Bot Killed Himself`)
                console.log("[Credits] Cxiy [Credits]")
                console.log("")
            } else if (input == "Eat") {
                console.clear()
                console.log(`[Project Cx] >>>  Eating Now`)
                bot.autoEat
                .eat(false)
                .then((successful) => {
                    console.log('Finished executing eating function', successful)
                    console.log("")
                })
                .catch((error) => {
                    console.error(error)
                })
            } else if (input == "totem") {
                const totemId = bot.registry.itemsByName.totem_of_undying.id
                if (bot.registry.itemsByName.totem_of_undying) {
                    const totem = bot.inventory.findInventoryItem(totemId, null)
                    if (totem) {
                      bot.equip(totem, 'off-hand')
                    }
                }
            } else if (input == "pvp") {
                if (pvpMode == false) {
                    pvpMode = true
                    setTimeout(() => {
                        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
                        if (sword) bot.equip(sword, 'hand')
                      }, 150)
                } else {
                    pvpMode = false
                }
                
                console.clear()
                console.log(`[Project Cx] >>>  PvP Toggled To [${String(pvpMode)}]`)
                console.log("[Credits] Cxiy [Credits]")
                console.log("")

                if (pvpMode == true) {
                    const player = bot.nearestEntity(entity => entity.type === "player")
                    bot.pvp.attack(player)
                } else {
                    bot.pvp.stop()
                }
            }
            else {
                if (!moveMode) {
                    console.clear()
                    console.log("[Project Cx] >>>  Invalid Command! Please Try Again!")
                    console.log("[Credits] Cxiy [Credits]")
                    console.log("")
                }
            }
        });

    })

    bot.on('death', () => {
        reset()
        console.clear()
        console.log(`[Project Cx] >>>  Bot Died!`)
        console.log("")
    })
    
    bot.on('kicked', (reason) => {
        if (reason != '{"translate":"multiplayer.disconnect.duplicate_login"}') {
            console.log(`Bot got kicked for [${reason}] !`)
            console.log(`Retrying To Connect In 6 Seconds....`)
            setTimeout(mainLoop, 6000);
        }
    })

    bot.on('error', (reason) => {
		console.log(`Bot Error > [${reason}] !`)
        console.log(`Retrying To Connect In 6 Seconds....`)
        setTimeout(mainLoop, 6000);
	})

    bot.on('autoeat_started', (item, offhand) => {
        console.clear()
        console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
    })
    
    bot.on('autoeat_finished', (item, offhand) => {
        console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
        console.log("")
    })


}
mainLoop()
