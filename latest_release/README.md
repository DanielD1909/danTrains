1.3.2 Patch Notes:
- Added horizontal scroll
- Fixed bug for 1.3.0

1.3.1 Patch Notes:
- Added FAQ Panel
- Fixed multiple save related glitches
- Added scrolling to panels
- Fixed some glitches with settings menu
- Fixed wrong train capacity for DLR07 thanks to notrickastley on discord.

1.3.0 Patch Notes:
- Added 1.2.2 beta compatibility
    - Track maintenance costs subject to change
- Fixed various glitches related to the save loader
- Added 6 trams from Melbourne

1.2.1 Patch Notes:
- Fixed a glitch which caused newly registered trains to have dramatically incorrect maxSlopePercentages
    - To fix any trains affected, simply enter the game, save again, and then reload

1.2.0 Patch Notes:
- Adjusted minCurveRadii to use a new formula.
    - If the new value smaller, the track will automatically update existing tracks, otherwise it will not to avoid breaking the game
- Increased parallel track separation and track clearance to more realistic values
- Cost multipliers are now based off of shape based area instead of a linear relationship
    - Aka bores are calculated as circles now
    - Also taking into account placement of track in the tube
- New tunnel costs are based off of said new track separation values
- For the sake of avoiding the bricking of prior saves, the new track geometry and associcated numbers are not retroactively applied.
    - I have not tested this but honestly I would be shocked if changing track parallel spacing for already laid track *didn't* brick a save
- Track multiplier explanations have been removed temporarily until a new UI is ready for them
    - The multipliers themselves are still there which is more important. Just know wider and/or catenary = tunnels more expensive. 
- Fixed the MBTA Blue Line behaving as if the entire line is *both* catenary and third rail
    - Now it uses catenary above ground and third-rail below

1.1.2 Patch Notes: 
- Fixed a glitch prevent legacy trains from being imported correctly

1.1.1 Patch Notes: 
- Actually fixed the glitch causing crashes on menu start for new users

1.1.0 Patch Notes:
- Hopefully fixed a glitch causing crashes on menu start
- Added Singapore (MRT and LRT)
- Added more tags (NYC A Division, NYC B Division, Future Tech, and Ansaldo-Breda Driverless Metros)
- Added unit conversions for those who are uncivilized
- Added depth multipliers (I am sorry for taking this long to add them)
- Expanded NYC rolling stock to include the entire current fleet + the future planned ones
- Added a new type of metro called the Weird Metro. This is for the trains which are metros but still have level crossings for some bizzare reason
- Made the description text smaller

Previously:
Welcome to the release of danTrains 1.0.0 "Phoenix"!

There's been a lot of changes since the last version so here's a broad summary changelog:
- danTrains is now a standalone mod with no other requirements. This was done primarily due to the outdatedness of addTrains.
- Three new menus have been added, two as pop ups in game and one on the main menu. The instructions will explain how to use them.
    - Panel 1 - Train Registration: Allows you to register trains in game
    - Panel 2 - Train Dictionary: Allows you to search through all the train types in more detail in game,
    - Panel 3 - Main Menu Save Loader: Allows saves to not break
- Perth, Australia has been added with 3 trains thanks to Pio from the SubwayBuilder discord
- Tags have been directly made visible
- danTrains has been added to Railyard (unless you were like super quick to this in which case I may be doing it rn)
- Mod structure has been changed to allow easier updating of train data which should provide faster train updates in the future
- Automation, Electrification, Track Gauge, and Loading Gauge are all things you can now choose for all trains when adding them
    - In the future this will affect track compatibility but the game cannot handle that yet
- Train speed on curves has been adjusted to match real life standards (based on track geometry but converted to lateral acceleration bc that is what the game uses)
- All costs have been set to approximate Mediterranean prices
    - I was not able to find good sources on my own so I will admit I asked ChatGPT for Italian prices and then did some scrutinizing
    - If you have better sources let me know
    - Train cost per hour is a very American metric as in Europe they do cost per km per passenger or just cost per km
    - This has basically universally lowered prices which does make the game easier but it is what everyone voted for
    - Commuter Rail is still very expensive tho. Because it is in real life.
- Spreadsheet has not been updated and is no longer a priority due to the existence of the in-game dictionary
- Lateral acceleration limits no longer affected by automation. 
- Added 1.2.1 beta compatibility for the new station length feature.
- Once registered, descriptions now include track type and creator. Trying to figure out the best way to do tags.
- Continents have been replaced with Regions since continents are big and hard to define while regions are smaller and slightly easier to define
- Train Dropdown is now typable inside of so you can just start typing and find what you want.
- Various other minor things I cannot remember at this exact moment 

PLEASE NOTE: NEW FEATURES ARE A LITTLE FINNICKY BUT NOTHING SHOULD BE GAMEBREAKING. I OFFER NO GUARANTEES THOUGH, JUST MY EXPERIENCE.

INSTRUCTIONS:

1. Registering trains:
    1. To register a train you need to open the registration tab once you are in a game and ensure Automation, Electrification, Track Gauge, and Loading Gauge are all set
    2. Click Preview
    3. Review the stats and see the description and also make sure your train lengths are right
    4. Click register to register
    5. Check to make sure it worked
    6. Save the game with a specific name so you can use it in the future (THINGS DO NOT SAVE WITHOUT AT LEAST AN AUTOSAVE, AND AN AUTOSAVE WILL OVERWRITE ANY OTHER AUTOSAVES)
2. Loading Saves:
    1. Locate the big panel in the main menu that should have "Dan Trains" in it
    2. Navigate the dropdown to the save you want to play.
    3. Press the white button
    4. Load your save as normal
3. Managing Save Data:
    1. If you want to delete any data, go to the panel at the front.
    2. Select the save data you want to delete from the dropdown.
    3. Press the red button.
    4. As a failsafe, you need to press a second (formerly dark red, now red) button
    5. If you click on the dropdown you should see that it is gone.
4. IMPORTING LEGACY SAVES:
    1. First, make sure the trains are DanTrains Gen 1 Trains and not from some other mod. I cannot import those ones.
    2. Open SubwayBuilder with the following mods enabled:
        1. [DanTrains Gen1 (0.3.1) (NEW VERSION)](https://github.com/DanielD1909/danTrainsGen1/releases/tag/Final)
        2. addTrains DT (comes with 0.3.1 DanTrains)
        3. DanTrains 1.0.0 Phoenix
    3. Open the game with the correct trains enabled via addTrains.
    4. Save the game (probably with a new name just in case)
    5. Exit to menu and then disable danTrains 0.3.1 and addTrains DT
    6. Open the game
    7. Follow Loading Saves instructions