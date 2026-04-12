export function FAQPanel() {
    return (
        <div style={{ overflowY: "auto", height: "100%", padding: "10px" }}>
            <div
                style={{
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    margin: "10px 0",
                    lineHeight: "1.2em",
                }}
            >
                danTrains FAQ Page
            </div>
            <em>
                Welcome to the danTrains FAQ Page. This lists some common issues people encounter and just general questions people have.
                <br   />
                If you have further questions, come to the mod thread in the Subway Builder Discord. I also post polls there about feature development.
            </em>
            <div style={{ marginTop: "10px" }}>
                1. How do I load an existing save?
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • On the main menu, there should be two menus, one for registering trains by save (left menu), and one for registering trains by id (right menu)
                    <br   />
                    • If you see only one menu, you do not have any saves with the mod yet.
                    <br   />
                    • The register button should change to say "Registered!" upon usage.
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                2. How do I register a train?
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • There should be a button on the top right bar that has a rail track. Click that.
                    <br   />
                    • Select the train you want, and modify the settings as you wish. See Questions 3, 4, and 9 for more info.
                    <br   />
                    • Click the Preview Button to view the train's stats.
                    <br   />
                    • If you are satisfied with the stats, click the register button, and a notification should pop up in the lower left
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                3. What on earth do the slider thingys do?
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • When disabled, each stat above is defined by the train you select, i.e. you will only see what lets say 1972 stock from London can do rather than all options
                    <br   />
                    • When enabled, each becomes a filter you can search for trains by.
                    <br   />
                    • Not all filter combos exist. Do not complain that you can't find a diesel LRT that uses rubber tyres and 600V 3 phase AC like an Automated People Mover.
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                4. Will you allow full train stat editing.
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • No. This is not a custom train editor. This is meant to replicate real life trains. If you think a stat is wrong, find me on discord and tell me.
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                5. What does the book button do?
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • This is the train dictionary, which enables filtering by more stats like max speed.
                    <br   />
                    • There was a feature to send trains from the dictionary to the registration menu, but it is broken and I have no clue how to fix it.
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                6. Train Data Questions
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • Pricing is based off of Mediterranean (Italian mainly) costs, due to the base game also doing so.
                    <br   />
                    • Min Curve Radii are based off of a rigid body model artificially adjusted to approximate realism. I don't have full data on bogeys so this will have to do.
                    <br   />
                    • Min Station Curve Radii are based off of EU standards for maximum gaps, adjusted for gap fillers.
                    <br   />
                    • Max Train speed is based off of operating speed where possible.
                    <br   />
                    • Car capacity is based off of 6 people per square meter to try and approximate base game capacity.
                    <br   />
                    • In general many stats use the R211 as a base standard as that is the heavy metro in vanilla.
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                7. What does the track setup mean in descriptions?
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    • It is of the format "[Gauge] [Voltage] ([Automation] | [Power Supply Code] | [Loading Gauge Code])"
                </div>
            </div>
            <div style={{ marginTop: "10px" }}>
                8. What do the individual stats do? (info is from left to right, top to bottom)
                <div style={{ marginLeft: "20px", fontSize: "0.9rem"}}>
                    a. Grade of Automation is basically how automated you want your train to be. This impacts station speed, operating costs, and stop times, as well as at grade crossing ability.
                    <div style={{ marginLeft: "20px", fontSize: "0.8rem"}}>
                        • GoA0 is full manual operation / on-sight operation with no automatic safety measures at all. This is rarely found nowadays because yk, safety.
                        <br   />
                        • GoA1 is manual operation with train protection systems such as auto enforced speed limits and the like. This is the general baseline standard for most rail around the world.
                        <br   />
                        • GoA2 is semi-automatic operation, where trains move from station to station automatically, but there is a driver in the cab to handle emergencies. Examples include the MTA's 7 train.
                        <br   />
                        • GoA3 is driverless operation, not to be confused with fully automatic operation. These trains don't have cabs but there is a qualified conductor on board to hit what is effectively a panic button just in case.
                        <br   />
                        • GoA4 is full automation - no driver and no cab and no staff required. Often these trains do have a staff member but they don't need special training beyond ticket enforcement or whatever.
                    </div>

                    b. Electrification Standard is what voltage you're running your trains with. Classical DC is 600V, Modern is 750V, etc. <strong>This does not impact anything <em>yet</em>.</strong>
                    <br   />

                    c. Track Gauge is the distance between the two rails. This affects turn radius. Also, anything other than standard is a bit more expensive to install due to needing special installation equipment.
                    <div style={{ marginLeft: "20px", fontSize: "0.8rem"}}>
                        • They also have a base tunnel height which impacts elevation multipliers
                    </div>

                    d. Loading Gauge for this mod is effectively the train width. This affects elevation multipliers in the ways below. Each standard is given a name for convenience.
                    <div style={{ marginLeft: "20px", fontSize: "0.8rem"}}>
                        • For boring (deep and regular), the cost multipliers are based off of the area difference of the circlular crossection required. Since its often set by height, only exceptionally wide trains increase this significantly.
                        <br   />
                        • For cut and cover, the cost multipliers are based off of the area difference of the rectangular crossection required. This is the primary impact of width.
                        <br   />
                        • For elevated, the multiplier impact is based purely on width as a % of the reference train (R211). The impact is divided by half. So 1.1x width = 1.05x elevated cost.
                    </div>

                    e. Power Supply is the method a train uses to get electricity. This impacts a variety of factors as detailed below.
                    <div style={{ marginLeft: "20px", fontSize: "0.8rem"}}>
                        • tr-above, tr-side, and tr-under are all third rail systems. The positions are where the shoe (i.e. the contactor) connects with the rail. For example, above means the shoe is sitting on top of the rail.
                        <br   />
                        • tr-under has slightly lower operating costs due to decreased accident risk, while tr-side has slightly increased costs due to complexity. By slight I mean literally 1%.
                        <br   />
                        • Third rail systems' main advantage is that they do not increase height needed in tunnels. Their main disadvantage is increased base track cost due to all the extra metal.
                        <br   />
                        • Catenary systems are any overhead wire system. They are cheaper base cost than third rail, but add more height to tunnels.
                        <br   />
                        • Four rail systems are systems with two rails, one powered and one ground. These are usually found in rubber tyre systems, since rubber wheels cannot be used as ground. Also weirdly the London Underground.
                        <br   />
                        • APS is the Alstom branding for ground-feeding tram power. Look up Alstom APS on wikipedia for more on how it works. Base cost is much higher but also does not increase tunnel height. Basically only for trams.
                        <br   />
                        • tr-under + catenary is based on the MBTA Blue Line which has catenary above ground and third rail underground. Will likely be retired in the future (but backwards compatibility will remain)
                    </div>

                    f. Train Type is not something you can change yourself, but its there so I'll mention it. This is what defines operating cost baselines,The main types are Metro, S-Bahn, Commuter, and LRT. Also defines whether at-grade is allowed.
                </div>
            </div>
        </div>
    );
}