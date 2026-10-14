/*
 * ==================== RAI SEASON 3 WIKI: CONTENT ====================
 *
 * Every page of the wiki is described here; assets/wiki.js turns it into
 * the glass pages. To add a page: add an entry below (path, title,
 * section, parent, summary, blocks), and create its folder with an
 * index.html copied from a page at the same depth (see CLAUDE.md).
 *
 * Links inside text: {{path|label}}, e.g. {{industrial/shredder|Shredder}}.
 *
 * Block types:
 *   {type:"text", html:"..."}                       a paragraph
 *   {type:"heading", text:"..."}                     a sub-heading
 *   {type:"callout", html:"..."}                     a highlighted tip
 *   {type:"list", items:["...", ...]}                a bullet list
 *   {type:"steps", title:"...", items:["...", ...]}  numbered steps
 *   {type:"recipes", title:"...", items:[{img, name, note}]}
 *   {type:"gallery", items:[{img, caption}]}         pictures
 *   {type:"table", head:[...], rows:[[...], ...]}
 *   {type:"children"}                                cards for the sub-pages
 *   {type:"changelog"}                               the Update Logs (from changelog)
 *
 * A page can also have quick: ["path", ...]: buttons in its heading box
 * (the home page uses this for "Frequently visited").
 *
 * Images live in /images and are named after the page they belong to.
 * The crafting information comes from JR's Crafting Guide for Season 3.
 */

window.WIKI = {

name: "Rai Season 3 Wiki",
version: "V1.0.7",

/* The Update Logs page (newest first). Add an entry with every new version. */
changelog: [
{version: "V1.0.7", date: "14.10.2026", items: [
"Shredder: a table of everything it grinds and what each powder is used for, and its recipe written out.",
"Consumables and Throwables: every alchemy process written out step by step, read from the process pictures."
]},
{version: "V1.0.6", date: "14.10.2026", items: [
"The wiki now uses the Rai server's emblem as its logo, in the top bar and as the browser tab icon."
]},
{version: "V1.0.5", date: "13.10.2026", items: [
"Parallax: the dusk landscape is now three layers (sky, far hills, near hills) that move at different speeds as you scroll, and shift a little with the mouse.",
"The landscape is drawn bigger than the screen, so it fills wide and tall screens, and the thin lines between its blocks are gone."
]},
{version: "V1.0.4", date: "13.10.2026", items: [
"A look of its own: a blocky Minecraft-style landscape at dusk behind the glass (stepped hills, a pixel sun, stars and clouds), a pixel grass-block logo, and warmer glass to match."
]},
{version: "V1.0.3", date: "13.10.2026", items: [
"New Update Logs page, opened from the glass button next to the wiki's name. Pressing the button turns it into clear liquid glass for a moment."
]},
{version: "V1.0.2", date: "13.10.2026", items: [
"New 'Frequently visited' buttons on the home page, led by {{tips|Tips & Tricks}}."
]},
{version: "V1.0.1", date: "13.10.2026", items: [
"New {{tips|Tips & Tricks}} page, with its own place in the menu.",
"New footer: Built by Sylvia Valentina, built with Visual Studio Code."
]},
{version: "V1.0.0", date: "13.10.2026", items: [
"First release of the Rai Season 3 Wiki: 25 pages covering {{agriculture|Agriculture}}, {{industrial|Industrial}}, {{geology|Geology}} and {{alchemy|Alchemy}}, based on JR's Crafting Guide for Season 3.",
"Search across every page, recipe cards, pictures that open larger, and a melting glass menu on phones."
]}
],

/* The menu bar: the home page, the four branches and Tips, each with its own accent colour. */
sections: [
{path: "", label: "Home"},
{path: "agriculture", label: "Agriculture", accent: "#3ddc84"},
{path: "industrial", label: "Industrial", accent: "#ff8a3d"},
{path: "geology", label: "Geology", accent: "#ffc94d"},
{path: "alchemy", label: "Alchemy", accent: "#b46bff"},
{path: "tips", label: "Tips", accent: "#22d3b6"}
],

pages: [

/* ---------------- Home ---------------- */

{path: "", title: "Rai Season 3 Wiki", section: "",
eyebrow: "The Rai Minecraft server",
/* Buttons in the big heading box. The first one is highlighted. */
quick: ["tips", "agriculture/food", "industrial/muskets", "industrial/shredder", "geology/rare-ores"],
summary: "The guide to Season 3: custom crops and cooking, steel and muskets, new ores, and alchemy.",
blocks: [
{type: "text", html: "Season 3 adds four new branches of crafting to the server. Each one brings its own materials, machines and recipes, and many of them depend on each other. Pick a branch to get started, or use the search."},
{type: "children"},
{type: "callout", html: "New to Season 3? Build a {{industrial/shredder|Shredder}} early. It is needed for alloys, ammunition, rare ores and some alchemy plants."}
]},

/* ---------------- Agriculture ---------------- */

{path: "agriculture", title: "Agriculture", section: "agriculture", parent: "",
image: "agriculture-1.jpg",
summary: "Five custom crops, eleven new dishes, the Juicer and the Kitchen Knife.",
blocks: [
{type: "text", html: "Agriculture covers the new crops, cooking and food processing of Season 3. There are five custom crops, lots of new food and a new processing tool."},
{type: "children"},
{type: "gallery", items: [
{img: "agriculture-1.jpg", caption: "The new crops growing on a farm"},
{img: "agriculture-2.jpg", caption: "Juices next to a Juicer"}
]}
]},

{path: "agriculture/crops", title: "Crops", section: "agriculture", parent: "agriculture",
image: "agriculture-crops-1.jpg",
summary: "Tomato, Cabbage, Rice, Onion and Rai Wheat: the five custom crops.",
blocks: [
{type: "text", html: "There are five custom crops in Season 3. Seeds for all of them can be bought at the central market. The new crops are the base of most Season 3 cooking."},
{type: "gallery", items: [{img: "agriculture-crops-1.jpg", caption: "Tomato, Cabbage, Rice, Onion and Rai Wheat"}]},
{type: "list", items: ["Tomato", "Cabbage", "Rice", "Onion", "{{agriculture/crops/rai-wheat|Rai Wheat}}"]},
{type: "text", html: "See {{agriculture/food|Food}} for what you can cook with them."},
{type: "children"}
]},

{path: "agriculture/crops/rai-wheat", title: "Rai Wheat", section: "agriculture", parent: "agriculture/crops",
summary: "The server's own wheat, one of the five custom crops.",
blocks: [
{type: "text", html: "Rai Wheat is one of the five custom crops of Season 3. Its seeds are sold at the central market."},
{type: "callout", html: "This page is still being written. More about Rai Wheat will be added soon."}
]},

{path: "agriculture/food", title: "Food", section: "agriculture", parent: "agriculture",
image: "agriculture-food-7.png",
summary: "Recipes for all eleven new dishes, from Apple Pie to Vegetable Soup.",
blocks: [
{type: "callout", html: "Read {{agriculture/crops|Crops}} and {{agriculture/knife|Kitchen Knife}} first: many dishes need the new crops and ingredients cut with the knife."},
{type: "recipes", title: "All dishes", items: [
{img: "agriculture-food-1.png", name: "Apple Pie", note: "8x Apple Slice, 1x Bread Roll"},
{img: "agriculture-food-2.png", name: "Bread Roll", note: "2x Wheat"},
{img: "agriculture-food-3.png", name: "Egg Sandwich", note: "1x Bread Slice, 1x Fried Egg, 1x Cooked Bacon"},
{img: "agriculture-food-4.png", name: "Fish Sandwich", note: "1x Bread Slice, 1x Cooked Cut Fish, 1x Cabbage"},
{img: "agriculture-food-5.png", name: "Fish Stew", note: "1x Cooked Cut Fish, 1x Potato, 1x Milk Bucket, 1x Onion"},
{img: "agriculture-food-6.png", name: "Fried Rice", note: "1x Cooked Rice, 1x Fried Egg, 1x Onion, 1x Cooked Chicken Cuts"},
{img: "agriculture-food-7.png", name: "Hamburger", note: "1x Beef Patty, 1x Cabbage, 1x Tomato, 1x Onion, 1x Bread Buns"},
{img: "agriculture-food-8.png", name: "Meat Pie", note: "1x Bread Roll, 1x Beef Patty, 1x Onion"},
{img: "agriculture-food-9.png", name: "Onion Soup", note: "1x Onion, 1x Bread, 1x Milk Bucket"},
{img: "agriculture-food-10.png", name: "Porridge", note: "1x Cooked Rice, 1x Milk Bucket"},
{img: "agriculture-food-11.png", name: "Vegetable Soup", note: "1x Cabbage, 1x Tomato, 1x Onion, 1x Cooked Rice, 1x Carrot"}
]}
]},

{path: "agriculture/juicer", title: "Juicer", section: "agriculture", parent: "agriculture",
image: "agriculture-juicer-1.png",
summary: "A machine that turns fruit and sugar into juices with potion effects.",
blocks: [
{type: "text", html: "The Juicer turns fruit and sugar into juice. First, craft the Juicer itself."},
{type: "recipes", items: [{img: "agriculture-juicer-1.png", name: "Juicer", note: "6x Glass Pane, 3x Iron Ingot"}]},
{type: "heading", text: "Juices"},
{type: "text", html: "With the Juicer you can make three juices from fruit and sugar."},
{type: "table", head: ["Juice", "Made from", "Effect"], rows: [
["Apple Juice", "2x Apple, 1x Sugar", "Regeneration"],
["Melon Juice", "2x Melon Slice, 1x Sugar", "Health Boost"],
["Berry Juice", "4x Sweet Berries or 4x Glow Berries, 1x Sugar", "Haste"]
]},
{type: "gallery", items: [{img: "agriculture-juicer-2.png", caption: "The Juicer's recipes"}]},
{type: "heading", text: "Fruit Juice"},
{type: "text", html: "Combine one of each juice in a crafting table to get 3 Fruit Juice, which gives all three effects in one drink."},
{type: "recipes", items: [{img: "agriculture-juicer-3.png", name: "Fruit Juice", note: "1x Apple Juice, 1x Melon Juice, 1x Berry Juice: makes 3"}]}
]},

{path: "agriculture/knife", title: "Kitchen Knife", section: "agriculture", parent: "agriculture",
image: "agriculture-knife-1.png",
summary: "The tool for cutting ingredients (it works as a weapon too).",
blocks: [
{type: "text", html: "The Kitchen Knife is needed to cut ingredients for cooking. It can be used as a weapon, but its main use is as a tool."},
{type: "recipes", items: [{img: "agriculture-knife-1.png", name: "Kitchen Knife", note: "1x Iron Ingot, 1x Stick"}]},
{type: "heading", text: "Cutting ingredients"},
{type: "text", html: "To cut an ingredient, put the knife and the ingredient in a crafting table. The knife loses some durability, and you get the cut ingredient."},
{type: "recipes", items: [
{img: "agriculture-knife-2.png", name: "Bread Slice", note: "Bread: makes 4x Bread Slice"},
{img: "agriculture-knife-3.png", name: "Bread Buns", note: "Bread Roll: makes Bread Buns"},
{img: "agriculture-knife-4.png", name: "Minced Beef", note: "Raw Beef: makes Minced Beef"},
{img: "agriculture-knife-5.png", name: "Raw Bacon", note: "Raw Porkchop: makes Raw Bacon"},
{img: "agriculture-knife-6.png", name: "Raw Mutton Chops", note: "Raw Mutton: makes Raw Mutton Chops"},
{img: "agriculture-knife-7.png", name: "Raw Cut Fish", note: "Raw Cod, Salmon or Tropical Fish: makes Raw Cut Fish"}
]}
]},

/* ---------------- Industrial ---------------- */

{path: "industrial", title: "Industrial", section: "industrial", parent: "",
image: "industrial-2.jpg",
summary: "Steel and bronze, blackpowder firearms, ammunition and the Shredder.",
blocks: [
{type: "text", html: "Industrial covers steel production, blackpowder firearms, and the machines and materials they need."},
{type: "callout", html: "Start with the {{industrial/shredder|Shredder}}: almost every industrial recipe needs it."},
{type: "children"},
{type: "gallery", items: [
{img: "industrial-1.jpg", caption: "Industrial materials"},
{img: "industrial-2.jpg", caption: "Industrial machines and parts"}
]}
]},

{path: "industrial/shredder", title: "Shredder", section: "industrial", parent: "industrial",
image: "industrial-shredder-1.png",
summary: "The machine that grinds ores and minerals into powder.",
blocks: [
{type: "text", html: "The Shredder is essential for alloys and other industrial recipes. It grinds ores and minerals into powder for further processing."},
{type: "recipes", items: [{img: "industrial-shredder-1.png", name: "Shredder", note: "Top row: 3 dark stone blocks. Middle row: Iron Ingot, empty, Iron Ingot. Bottom row: Iron Ingot, Iron Block, Iron Ingot."}]},
{type: "heading", text: "What it grinds"},
{type: "table", head: ["Put in", "Get out", "Used for"], rows: [
["Coal", "Coal Powder", "{{industrial/steel-alloys|Steel}}"],
["Iron Ingot", "Iron Powder", "{{industrial/steel-alloys|Steel}}, {{geology/rare-ores/multi-ore-compound|Multi-Ore Ingots}}"],
["Copper Ingot", "Copper Powder", "{{industrial/steel-alloys|Bronze}}"],
["Tin Ingot", "Tin Powder", "{{industrial/steel-alloys|Bronze}}"],
["Charcoal", "Charcoal Powder", "Blackpowder ({{industrial/ammunitions|Ammunitions}})"],
["Diamond", "Diamond Powder", "{{geology/rare-ores/cherry-ore|Cherry Ingots}}"],
["Multi-Ore crystals", "Multi-Ore Powder", "{{geology/rare-ores/multi-ore-compound|Multi-Ore Ingots}}"],
["Blazeroot Plant", "Blazeroot Powder", "{{alchemy/consumables|Stim Mixture}}, {{alchemy/throwables|Flame Batch, Volatile Compound}}"],
["Anetherbloom Flower", "Anetherbloom Powder", "{{alchemy/throwables|Volatile Compound, Shock Gas}}"]
]},
{type: "gallery", items: [
{img: "industrial-shredder-2.png", caption: "The Shredder's menu: coal, iron, diamond, rare ore and more, each into powder"},
{img: "industrial-shredder-3.png", caption: "Charcoal into Charcoal Powder"}
]},
{type: "text", html: "Shredder powders are used for {{industrial/steel-alloys|Steel & Alloys}}, blackpowder ({{industrial/ammunitions|Ammunitions}}), the rare ores ({{geology/rare-ores/multi-ore-compound|Multi-Ore}} and {{geology/rare-ores/cherry-ore|Cherry Ore}}) and some {{alchemy/machines|alchemy}} plants."}
]},

{path: "industrial/steel-alloys", title: "Steel & Alloys", section: "industrial", parent: "industrial",
summary: "How to make Steel and Bronze.",
blocks: [
{type: "callout", html: "You need a {{industrial/shredder|Shredder}} before you start."},
{type: "text", html: "Alloys are made by grinding the ingredients into powder in the Shredder, mixing the powders in a crafting table, and smelting the mixture in a blast furnace."},
{type: "steps", title: "Steel", items: [
"Put 1 Iron Ingot and 1 Coal in the Shredder to get 1 Iron Powder and 1 Coal Powder.",
"Combine them in a crafting table to get Pig-Iron Mixture.",
"Smelt it in a blast furnace to get a Raw Iron Bloom.",
"Refine the Raw Iron Bloom in a stonecutter to get a Steel Ingot."
]},
{type: "steps", title: "Bronze", items: [
"Put 1 Copper Ingot and 1 Tin Ingot in the Shredder to get 1 Copper Powder and 1 Tin Powder.",
"Combine them in a crafting table to get Bronze Alloy Powder.",
"Smelt it in a blast furnace to get a Bronze Ingot."
]},
{type: "text", html: "Tin is one of the {{geology/basic-ores|basic ores}}. Steel and Bronze are used for {{industrial/muskets|Muskets}}."}
]},

{path: "industrial/muskets", title: "Muskets", section: "industrial", parent: "industrial",
image: "industrial-muskets-musket-3.png",
summary: "Three blackpowder firearms: Musket, Flintlock and Blunderbuss.",
blocks: [
{type: "text", html: "Muskets are hard and expensive to craft because of their power. There are three types, each with its own reload speed and damage."},
{type: "table", head: ["Firearm", "Damage", "Reload", "Ammunition"], rows: [
["{{industrial/muskets/musket|Musket}}", "Good (the baseline)", "Decent", "Musket Cartridge"],
["{{industrial/muskets/flintlock|Flintlock}}", "Half of a Musket", "Twice as fast", "Flintlock Cartridge"],
["{{industrial/muskets/blunderbuss|Blunderbuss}}", "More than a Musket", "Slower", "Blunderbuss Slug Cartridge"]
]},
{type: "children"},
{type: "text", html: "All three need {{industrial/steel-alloys|Bronze and Steel}}. See {{industrial/ammunitions|Ammunitions}} for the cartridges."}
]},

{path: "industrial/muskets/musket", title: "Musket", section: "industrial", parent: "industrial/muskets",
image: "industrial-muskets-musket-3.png",
summary: "The standard firearm: good damage and a decent reload.",
blocks: [
{type: "text", html: "A Musket needs 2 Bronze Ingots, 1 Wooden Stock and 1 Steel Barrel. See {{industrial/steel-alloys|Steel & Alloys}} for Bronze and Steel."},
{type: "recipes", title: "Parts", items: [
{img: "industrial-muskets-musket-1.png", name: "Wooden Stock", note: "3x Log"},
{img: "industrial-muskets-musket-2.png", name: "Steel Barrel", note: "3x Steel Ingot"}
]},
{type: "recipes", title: "Musket", items: [
{img: "industrial-muskets-musket-3.png", name: "Musket", note: "2x Bronze Ingot, 1x Wooden Stock, 1x Steel Barrel"}
]},
{type: "text", html: "The Musket fires Musket Cartridges: see {{industrial/ammunitions|Ammunitions}}."}
]},

{path: "industrial/muskets/flintlock", title: "Flintlock", section: "industrial", parent: "industrial/muskets",
image: "industrial-muskets-flintlock-3.png",
summary: "Reloads twice as fast as a Musket, for half the damage.",
blocks: [
{type: "text", html: "A Flintlock needs 1 Bronze Ingot, 1 Small Stock and 1 Short Steel Barrel. See {{industrial/steel-alloys|Steel & Alloys}} for Bronze and Steel."},
{type: "recipes", title: "Parts", items: [
{img: "industrial-muskets-flintlock-1.png", name: "Small Stock", note: "2x Log"},
{img: "industrial-muskets-flintlock-2.png", name: "Short Steel Barrel", note: "2x Steel Ingot"}
]},
{type: "recipes", title: "Flintlock", items: [
{img: "industrial-muskets-flintlock-3.png", name: "Flintlock", note: "1x Bronze Ingot, 1x Small Stock, 1x Short Steel Barrel"}
]},
{type: "text", html: "The Flintlock fires Flintlock Cartridges: see {{industrial/ammunitions|Ammunitions}}."}
]},

{path: "industrial/muskets/blunderbuss", title: "Blunderbuss", section: "industrial", parent: "industrial/muskets",
image: "industrial-muskets-blunderbuss-3.png",
summary: "More damage than a Musket, but a slower reload.",
blocks: [
{type: "text", html: "A Blunderbuss needs 3 Bronze Ingots, 1 Wooden Stock and 1 Wide Steel Barrel. See {{industrial/steel-alloys|Steel & Alloys}} for Bronze and Steel."},
{type: "recipes", title: "Parts", items: [
{img: "industrial-muskets-blunderbuss-1.png", name: "Wooden Stock", note: "3x Log"},
{img: "industrial-muskets-blunderbuss-2.png", name: "Wide Steel Barrel", note: "6x Steel Ingot"}
]},
{type: "recipes", title: "Blunderbuss", items: [
{img: "industrial-muskets-blunderbuss-3.png", name: "Blunderbuss", note: "3x Bronze Ingot, 1x Wooden Stock, 1x Wide Steel Barrel"}
]},
{type: "text", html: "The Blunderbuss fires Blunderbuss Slug Cartridges: see {{industrial/ammunitions|Ammunitions}}."}
]},

{path: "industrial/ammunitions", title: "Ammunitions", section: "industrial", parent: "industrial",
image: "industrial-ammunitions-5.png",
summary: "Blackpowder, musket balls and cartridges for all three firearms.",
blocks: [
{type: "heading", text: "Blackpowder"},
{type: "text", html: "All ammunition needs Blackpowder. Combine Charcoal Powder, Sulfur and Saltpeter in a crafting table. Sulfur and Saltpeter ore can be mined (see {{geology/basic-ores|Basic Ores}}), and Charcoal Powder is made by putting Charcoal in the {{industrial/shredder|Shredder}}."},
{type: "recipes", items: [{img: "industrial-ammunitions-1.png", name: "Blackpowder", note: "1x Charcoal Powder, 1x Sulfur, 1x Saltpeter"}]},
{type: "heading", text: "Musket balls"},
{type: "text", html: "Mine Lead ore for Raw Lead, and smelt it into a Lead Ingot. One Lead Ingot in a crafting table makes 3 Musket Balls, and one Musket Ball makes 2 Small Musket Balls."},
{type: "recipes", items: [
{img: "industrial-ammunitions-2.png", name: "Musket Ball", note: "1x Lead Ingot: makes 3"},
{img: "industrial-ammunitions-3.png", name: "Small Musket Ball", note: "1x Musket Ball: makes 2"}
]},
{type: "heading", text: "Cartridges"},
{type: "text", html: "Each cartridge also needs one sheet of Paper. Which cartridge you need depends on your firearm."},
{type: "recipes", items: [
{img: "industrial-ammunitions-4.png", name: "Flintlock Cartridge", note: "1x Small Musket Ball, 1x Blackpowder, 1x Paper"},
{img: "industrial-ammunitions-5.png", name: "Musket Cartridge", note: "1x Musket Ball, 1x Blackpowder, 1x Paper"},
{img: "industrial-ammunitions-6.png", name: "Blunderbuss Slug Cartridge", note: "1x Lead Ingot, 1x Blackpowder, 1x Paper"}
]}
]},

/* ---------------- Geology ---------------- */

{path: "geology", title: "Geology", section: "geology", parent: "",
image: "geology-2.jpg",
summary: "New ores to mine: five basic ores and two rare ones.",
blocks: [
{type: "text", html: "Season 3 adds a lot of new ores and minerals to mine."},
{type: "children"},
{type: "gallery", items: [
{img: "geology-1.jpg", caption: "Down in the mines"},
{img: "geology-2.jpg", caption: "Ore in a cave wall"}
]}
]},

{path: "geology/basic-ores", title: "Basic Ores", section: "geology", parent: "geology",
image: "geology-basic-ores-1.jpg",
summary: "Aluminum, Lead, Saltpeter, Tin and Sulfur: the common ores of Season 3.",
blocks: [
{type: "text", html: "These custom ores are the commonly found ores of Season 3."},
{type: "gallery", items: [{img: "geology-basic-ores-1.jpg", caption: "Aluminum, Lead, Saltpeter, Tin and Sulfur"}]},
{type: "table", head: ["Ore", "Used in"], rows: [
["Aluminum", "{{alchemy|Alchemy}} (the alchemy machines)"],
["Lead", "{{industrial/ammunitions|Ammunitions}}"],
["Saltpeter", "Blackpowder ({{industrial/ammunitions|Ammunitions}})"],
["Tin", "Bronze ({{industrial/steel-alloys|Steel & Alloys}})"],
["Sulfur", "Blackpowder ({{industrial/ammunitions|Ammunitions}})"]
]},
{type: "text", html: "All of them are found at Y-level 5 and above. Only Lead and Tin also have deepslate variants, found below Y-level -5."}
]},

{path: "geology/rare-ores", title: "Rare Ores", section: "geology", parent: "geology",
image: "geology-rare-ores-cherry-ore-1.jpg",
summary: "Multi-Ore Compound and Cherry Ore: much harder to get, much more powerful.",
blocks: [
{type: "text", html: "Rare ores are much harder to get than the basic ores, but the tools and armor made from them are many times more powerful."},
{type: "steps", title: "From strong to strongest", items: [
"Netherite (vanilla)",
"{{geology/rare-ores/multi-ore-compound|Multi-Ore Compound}}: mined with a Netherite Pickaxe or better",
"{{geology/rare-ores/cherry-ore|Cherry Ore}}: mined only with a Multi-Ore Pickaxe"
]},
{type: "children"}
]},

{path: "geology/rare-ores/multi-ore-compound", title: "Multi-Ore Compound", section: "geology", parent: "geology/rare-ores",
image: "geology-rare-ores-multi-ore-compound-1.jpg",
summary: "The first step above Netherite. Found only in deepslate.",
blocks: [
{type: "text", html: "This colourful, many-sided ore is the first step above Netherite. It is only found in deepslate, never in regular stone, and can only be mined with a Netherite Pickaxe or better."},
{type: "gallery", items: [{img: "geology-rare-ores-multi-ore-compound-1.jpg", caption: "Multi-Ore Compound"}]},
{type: "steps", title: "Making a Multi-Ore Ingot", items: [
"Put the crystals you get from mining Multi-Ore in the {{industrial/shredder|Shredder}} to get Multi-Ore Powder. You also need Iron Powder from the Shredder.",
"Combine both powders in a crafting table to get Mineral Mixture.",
"Smelt it in a blast furnace to get a Multi-Ore Ingot."
]},
{type: "gallery", items: [{img: "geology-rare-ores-multi-ore-compound-2.jpg", caption: "From crystals to a Multi-Ore Ingot"}]},
{type: "text", html: "Multi-Ore Ingots make a pickaxe, a sword and a full set of armor. You need the Multi-Ore Pickaxe to mine {{geology/rare-ores/cherry-ore|Cherry Ore}}."}
]},

{path: "geology/rare-ores/cherry-ore", title: "Cherry Ore", section: "geology", parent: "geology/rare-ores",
image: "geology-rare-ores-cherry-ore-1.jpg",
summary: "The strongest ore of Season 3. Needs a Multi-Ore Pickaxe.",
blocks: [
{type: "text", html: "Cherry Ore is the next step up from {{geology/rare-ores/multi-ore-compound|Multi-Ore}} and the strongest ore in Season 3. It is only found in regular stone, never in deepslate, and can only be mined with a Multi-Ore Pickaxe."},
{type: "gallery", items: [{img: "geology-rare-ores-cherry-ore-1.jpg", caption: "Cherry Ore"}]},
{type: "steps", title: "Making a Cherry Ingot", items: [
"Smelt the Cherry Ore in a furnace to burn away its impurities.",
"Grind a Diamond into Diamond Powder in the {{industrial/shredder|Shredder}}, and combine it with the pure Cherry Ore in a crafting table to get Cherry-Diamond Mixture.",
"Smelt it in a blast furnace to get an Uncut Cherry Ingot.",
"Cut and refine it in a stonecutter to get a Cherry Ingot."
]},
{type: "gallery", items: [{img: "geology-rare-ores-cherry-ore-2.jpg", caption: "From Cherry Ore to a Cherry Ingot"}]},
{type: "text", html: "Like Multi-Ore, Cherry Ingots make a sword, a pickaxe and a full set of armor."}
]},

/* ---------------- Alchemy ---------------- */

{path: "alchemy", title: "Alchemy", section: "alchemy", parent: "",
image: "alchemy-1.jpg",
summary: "Mixing herbs and plants with machines: crops, machines, consumables and throwables.",
blocks: [
{type: "text", html: "Alchemy is the last branch of Season 3: mixing strange herbs and plants together with machines to see what happens."},
{type: "children"},
{type: "gallery", items: [
{img: "alchemy-1.jpg", caption: "Alchemy crops"},
{img: "alchemy-2.jpg", caption: "Alchemy machines and products"}
]}
]},

{path: "alchemy/machines", title: "Machines", section: "alchemy", parent: "alchemy",
image: "alchemy-machines-1.jpg",
summary: "Distillation Setup, Gas Extractor, Centrifuge and Chemistry Bench.",
blocks: [
{type: "text", html: "Alchemy needs four machines. You may also want a {{industrial/shredder|Shredder}}, which is needed to process some plants. The machines are made with Aluminum, one of the {{geology/basic-ores|basic ores}}."},
{type: "gallery", items: [{img: "alchemy-machines-1.jpg", caption: "Distillation Setup, Gas Extractor, Centrifuge and Chemistry Bench"}]},
{type: "recipes", title: "Recipes", items: [
{img: "alchemy-machines-2.png", name: "Distillation Setup", note: "4x Aluminum Ingot, 2x Glass, 3x Glass Bottle"},
{img: "alchemy-machines-4.png", name: "Centrifuge", note: "3x Aluminum Ingot, 2x Glass, 3x Iron Ingot, 1x Diamond"},
{img: "alchemy-machines-3.png", name: "Gas Extractor", note: "3x Aluminum Ingot, 2x Glass, 3x Iron Ingot, 1x Centrifuge"},
{img: "alchemy-machines-5.png", name: "Chemistry Bench", note: "4x Aluminum Ingot, 3x Iron Ingot, 1x Centrifuge, 1x Distillation Setup"}
]},
{type: "text", html: "Make the Centrifuge and the Distillation Setup first: the Gas Extractor and the Chemistry Bench are built from them."}
]},

{path: "alchemy/crops", title: "Alchemy Crops", section: "alchemy", parent: "alchemy",
image: "alchemy-cropsalc-2.jpg",
summary: "Bitterroot, Nightshade, Sundew, Blazeroot and the rare Anetherbloom.",
blocks: [
{type: "text", html: "Five crops are used in alchemy. Seeds for all of them are sold at the Market."},
{type: "gallery", items: [{img: "alchemy-cropsalc-1.jpg", caption: "Bitterroot, Nightshade, Sundew and Blazeroot"}]},
{type: "text", html: "The four basic crops, Bitterroot, Nightshade, Sundew and Blazeroot, grow normally and are used for most alchemy recipes. They sometimes drop seeds when harvested, but rarely."},
{type: "heading", text: "Anetherbloom"},
{type: "text", html: "Anetherbloom takes much longer to grow, but it is used for the more potent and dangerous products. Its seeds are rare and often low in stock at the Market, and only players with specific skills can get seeds from it when harvesting."},
{type: "gallery", items: [{img: "alchemy-cropsalc-2.jpg", caption: "Anetherbloom"}]}
]},

{path: "alchemy/consumables", title: "Consumables", section: "alchemy", parent: "alchemy",
image: "alchemy-consumables-2.jpg",
summary: "Three drinks with strong buffs.",
blocks: [
{type: "text", html: "Consumables are one half of alchemy. There are three, each with its own buffs."},
{type: "table", head: ["Consumable", "Effects"], rows: [
["Regeneration Tonic", "Regeneration and Saturation for a short time"],
["Stim Mixture", "Instant Health, and a major Health Boost for a medium time"],
["Anetherbloom Distillate", "Major Regeneration for a short time, and Speed, Resistance, Jump Boost and Strength for a medium time"]
]},
{type: "text", html: "Each one is made in a sequence of steps through the {{alchemy/machines|alchemy machines}}, from {{alchemy/crops|alchemy crops}}."},
{type: "steps", title: "Regeneration Tonic", items: [
"Put a Sundew Herb in the Centrifuge to get Regeneration Extract.",
"Put the Regeneration Extract in the Chemistry Bench to get a Regeneration Tonic."
]},
{type: "steps", title: "Stim Mixture", items: [
"Put a Blazeroot Plant in the {{industrial/shredder|Shredder}} to get Blazeroot Powder.",
"Put a Sundew Herb in the Centrifuge to get Regeneration Extract.",
"Put the Blazeroot Powder and the Regeneration Extract in the Chemistry Bench to get a Stim Mixture."
]},
{type: "steps", title: "Anetherbloom Distillate", items: [
"Put an Anetherbloom Flower in the Centrifuge to get Anetherbloom Extract.",
"Put the Anetherbloom Extract in the Distillation Setup to get an Anetherbloom Distillate."
]},
{type: "gallery", items: [
{img: "alchemy-consumables-1.jpg", caption: "Regeneration Tonic"},
{img: "alchemy-consumables-2.jpg", caption: "Stim Mixture"},
{img: "alchemy-consumables-3.jpg", caption: "Anetherbloom Distillate"}
]}
]},

{path: "alchemy/throwables", title: "Throwables", section: "alchemy", parent: "alchemy",
image: "alchemy-throwables-4.jpg",
summary: "Five thrown weapons, mainly for PvP.",
blocks: [
{type: "text", html: "Throwables are the other half of alchemy. There are five, mainly used in PvP."},
{type: "table", head: ["Throwable", "What it does"], rows: [
["Flame Batch", "Sets an area on fire"],
["Volatile Compound", "Ignites and explodes"],
["Smoke Canister", "A large area of smoke and Blindness"],
["Choke Gas", "A gas cloud with moderate negative effects, like Poison and Slowness"],
["Shock Gas", "A gas cloud with major negative effects, like Wither, Weakness and Slowness"]
]},
{type: "text", html: "Each one is made in a sequence of steps through the {{alchemy/machines|alchemy machines}}."},
{type: "steps", title: "Flame Batch", items: [
"Put a Blazeroot Plant in the {{industrial/shredder|Shredder}} to get Blazeroot Powder.",
"Put the Blazeroot Powder and Gunpowder in the Chemistry Bench to get a Flame Batch."
]},
{type: "steps", title: "Volatile Compound", items: [
"Put an Anetherbloom Flower in the Shredder to get Anetherbloom Powder.",
"Put a Blazeroot Plant in the Shredder to get Blazeroot Powder.",
"Put both powders in the Chemistry Bench to get a Volatile Compound."
]},
{type: "steps", title: "Smoke Canister", items: [
"Put Gunpowder and {{industrial/ammunitions|Blackpowder}} in the Chemistry Bench to get a Smoke Canister."
]},
{type: "steps", title: "Choke Gas", items: [
"Put a Nightshade Flower in the Centrifuge to get Toxic Extract.",
"Put the Toxic Extract and a Glass Bottle in the Gas Extractor to get Choke Gas."
]},
{type: "steps", title: "Shock Gas", items: [
"Put an Anetherbloom Flower in the Shredder to get Anetherbloom Powder.",
"Put a Nightshade Flower in the Centrifuge to get Toxic Extract.",
"Put the Anetherbloom Powder and the Toxic Extract in the Gas Extractor to get Shock Gas."
]},
{type: "gallery", items: [
{img: "alchemy-throwables-1.jpg", caption: "Flame Batch"},
{img: "alchemy-throwables-2.jpg", caption: "Volatile Compound"},
{img: "alchemy-throwables-3.jpg", caption: "Smoke Canister"},
{img: "alchemy-throwables-4.jpg", caption: "Choke Gas"},
{img: "alchemy-throwables-5.jpg", caption: "Shock Gas"}
]}
]},

/* ---------------- Update Logs (not in the menu: opened from the button in the top bar) ---------------- */

{path: "updates", title: "Update Logs", section: "updates",
eyebrow: "Rai Season 3 Wiki",
summary: "Every change to the wiki, newest first.",
blocks: [
{type: "changelog"}
]},

/* ---------------- Tips & Tricks ---------------- */

{path: "tips", title: "Tips & Tricks", section: "tips", parent: "",
image: "agriculture-2.jpg",
summary: "Shortcuts, good habits and things worth knowing before you start.",
blocks: [
{type: "text", html: "A collection of useful tips for Season 3, put together from the rest of the wiki. Follow the links for the full recipes."},

{type: "heading", text: "Getting started"},
{type: "list", items: [
"Build a {{industrial/shredder|Shredder}} early. You need it for alloys, blackpowder, both rare ores and some alchemy plants.",
"Get a blast furnace and a stonecutter too. Steel, Bronze and the rare ingots all go through the blast furnace, and Steel and Cherry Ingots are finished in the stonecutter.",
"Iron is in demand everywhere: the {{agriculture/knife|Kitchen Knife}}, the {{agriculture/juicer|Juicer}}, the {{alchemy/machines|alchemy machines}}, Steel, and the Iron Powder for {{geology/rare-ores/multi-ore-compound|Multi-Ore}}. Keep a good stock.",
"Save your diamonds. You need one for the {{alchemy/machines|Centrifuge}}, and one for every {{geology/rare-ores/cherry-ore|Cherry Ingot}} (as Diamond Powder)."
]},

{type: "heading", text: "Mining"},
{type: "list", items: [
"The {{geology/basic-ores|basic ores}} are found at Y-level 5 and above. Below Y-level -5, look for the deepslate variants of Lead and Tin.",
"{{geology/rare-ores/multi-ore-compound|Multi-Ore}} is only in deepslate and needs a Netherite Pickaxe. {{geology/rare-ores/cherry-ore|Cherry Ore}} is only in regular stone and needs a Multi-Ore Pickaxe.",
"So the order is: Netherite Pickaxe, then Multi-Ore, then a Multi-Ore Pickaxe, then Cherry Ore.",
"Mine Aluminum if you want to do alchemy: every alchemy machine is made with it."
]},

{type: "heading", text: "Firearms and ammunition"},
{type: "table", head: ["One Lead Ingot makes", "Enough for"], rows: [
["1 Blunderbuss Slug Cartridge", "1 Blunderbuss shot"],
["3 Musket Balls", "3 Musket shots"],
["6 Small Musket Balls (3 Musket Balls, each split in two)", "6 Flintlock shots"]
]},
{type: "list", items: [
"If Lead is scarce, the {{industrial/muskets/flintlock|Flintlock}} gets the most shots out of it, and it reloads twice as fast (for half the damage).",
"The {{industrial/muskets/blunderbuss|Blunderbuss}} hits hardest but reloads slowest, and every cartridge uses a whole Lead Ingot.",
"Every cartridge also needs one Blackpowder and one Paper, so keep Sugar Cane farms going."
]},

{type: "heading", text: "Cooking"},
{type: "list", items: [
"One loaf of Bread cut with the {{agriculture/knife|Kitchen Knife}} gives 4 Bread Slices: enough for 4 sandwiches.",
"{{agriculture/juicer|Fruit Juice}} is the best value: one Apple, Melon and Berry Juice make 3 Fruit Juices, and each one gives all three effects.",
"Onion goes into six of the eleven {{agriculture/food|dishes}}. Plant plenty."
]},

{type: "heading", text: "Alchemy"},
{type: "list", items: [
"Build the Centrifuge and the Distillation Setup first: the Gas Extractor and the Chemistry Bench are made from them.",
"The basic {{alchemy/crops|alchemy crops}} rarely drop seeds, so plan on buying more at the Market.",
"Anetherbloom seeds are rare and grow very slowly. Use them for the products that need them."
]},

{type: "callout", html: "Know a good tip that isn't here? It can be added at any time."}
]}

]
};
