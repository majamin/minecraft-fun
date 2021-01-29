/*
__________        .__        __                
\______   \_____  |__| _____/  |_  ___________ 
 |     ___/\__  \ |  |/    \   __\/ __ \_  __ \
 |    |     / __ \|  |   |  \  | \  ___/|  | \/
 |____|    (____  /__|___|  /__|  \___  >__|   
                \/        \/          \/       
*/

/*
Chat commands:
    level <int>         levels the ground where player stands
                        <int> height of air cleared above ground
                        type 'level' to turn off
    digger <int>        destroys blocks around player with "radius" <int>
                        type 'digger' to turn off
    mark1               records spot where player stands as mark1
    mark2               records spot where player stands as mark2
    wall                creates a rectangular prism from mark1 to mark2
    air                 replaces blocks from mark1 to mark2 by AIR
    copy                copies prism from mark1 to mark2
    paste               paste blocks copied with copy command at mark1
*/

// change these as you please
let wall_material = SMOOTH_SANDSTONE

// change at your own risk
let levelTrue = 0 // don't level by default
let diggerTrue = 0 // don't dig by default
let levelHeight = 2
let mark1 = builder.position()
let mark2 = builder.position()

let level_material = get_material()

/*
___________                   __  .__                      
\_   _____/_ __  ____   _____/  |_|__| ____   ____   ______
 |    __)|  |  \/    \_/ ___\   __\  |/  _ \ /    \ /  ___/
 |     \ |  |  /   |  \  \___|  | |  (  <_> )   |  \\___ \ 
 \___  / |____/|___|  /\___  >__| |__|\____/|___|  /____  >
     \/             \/     \/                    \/     \/
*/

function get_material (){
    agent.teleportToPlayer()
    let block = agent.inspect(AgentInspection.Block, DOWN)
    return block
}

// creates dirt and air
function leveler (depth: number) {
    blocks.fill(
        level_material,
        positions.create(-1 * depth, -2, -1 * depth),
        positions.create(depth, -1, depth),
        FillOperation.Replace
    )
    blocks.fill(
        blocks.blockByName("air"),
        positions.create(-1 * depth, 2 * depth, -1 * depth),
        positions.create(depth, 0, depth),
        FillOperation.Replace
    )
}

// creates dirt and air
function digger (depth: number) {
    blocks.fill(
        blocks.blockByName("air"),
        positions.create(-1 * depth, depth + 1, -1 * depth),
        positions.create(depth, -depth + 1, depth),
        FillOperation.Destroy
    )
}

/*
________ .__            __                                                    .___      
\_   ___ \|  |__ _____ _/  |_    ____  ____   _____   _____ _____    ____    __| _/______
/    \  \/|  |  \\__  \\   __\ _/ ___\/  _ \ /     \ /     \\__  \  /    \  / __ |/  ___/
\     \___|   Y  \/ __ \|  |   \  \__(  <_> )  Y Y  \  Y Y  \/ __ \|   |  \/ /_/ |\___ \ 
 \______  /___|  (____  /__|    \___  >____/|__|_|  /__|_|  (____  /___|  /\____ /____  >
        \/     \/     \/            \/            \/      \/     \/     \/      \/    \/ 
*/

// command to mark a spot
player.onChat("mark1", function () {
    builder.teleportTo(player.position())
    builder.move(DOWN, 1)
    mark1 = builder.position()
    builder.place(YELLOW_CONCRETE)
})

player.onChat("mark2", function () {
    builder.teleportTo(player.position())
    builder.move(DOWN, 1)
    mark2 = builder.position()
    builder.place(RED_CONCRETE)
})

// command to make a wall
player.onChat("wall", function () {
    builder.teleportTo(mark1)
    builder.mark()
    builder.teleportTo(mark2)
    builder.fill(wall_material)
    builder.place(YELLOW_CONCRETE)
    mark1 = mark2
})

// command to delete blocks (replace with air)
player.onChat("air", function () {
    builder.teleportTo(mark1)
    builder.mark()
    builder.teleportTo(mark2)
    builder.fill(AIR)
    builder.place(YELLOW_CONCRETE)
    mark1 = mark2
})

// command to copy blocks
player.onChat("copy", function () {
    builder.teleportTo(mark1)
    builder.mark()
    builder.teleportTo(mark2)
    builder.copy()
})

// command to paste blocks
player.onChat("paste", function () {
    builder.teleportTo(mark1)
    builder.paste()
})

// enables or disables levelling (disabled by default)
player.onChat("level", function (depth) {  
    level_material = get_material()
    levelTrue = (levelTrue + 1) % 2
    if (levelTrue == 0) {
        player.say("leveling off")
    } else {
        levelHeight = depth
        player.say("leveling with depth " + depth)
    }
})

// enables or disables levelling (disabled by default)
player.onChat("digger", function (depth) {  
    diggerTrue = (diggerTrue + 1) % 2
    if (diggerTrue == 0) {
        player.say("digging off")
    } else {
        levelHeight = depth
        player.say("digging with depth " + depth)
    }
})

/*
   _____         .__        
  /     \ _____  |__| ____  
 /  \ /  \\__  \ |  |/    \ 
/    Y    \/ __ \|  |   |  \
\____|__  (____  /__|___|  /
        \/     \/        \/ 
*/

// loop for continuous levelling or digging
loops.forever(function () {
    if (levelTrue == 1) {
        diggerTrue = 0
        leveler(levelHeight)
    } else if (diggerTrue == 1) {
        levelTrue = 0
        digger(levelHeight)
    }
}) 