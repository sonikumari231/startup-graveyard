import type { Startup } from "../types";

/** Sample data used when the API is not reachable. Same shape as GET /api/startups. */
export const STARTUPS: Startup[] = [
  {
    "id": "quibi",
    "name": "Quibi",
    "what": "Premium short-form video made for phones, in episodes under ten minutes.",
    "sector": "Media",
    "country": "US",
    "hq": "Los Angeles, California",
    "founded": 2018,
    "closedYear": 2020,
    "closedLabel": "Oct 2020",
    "raisedMillions": 1750,
    "status": "Shut down",
    "founders": [
      "Jeffrey Katzenberg",
      "Meg Whitman"
    ],
    "investors": [
      "Disney",
      "NBCUniversal",
      "Alibaba",
      "Sony Pictures"
    ],
    "competitors": [
      "Netflix",
      "YouTube",
      "TikTok",
      "Disney+"
    ],
    "reasons": [
      {
        "cause": "market",
        "title": "Viewers did not need it",
        "text": "Free clips on YouTube and TikTok already covered short viewing, and Netflix covered long viewing. Quibi never showed a gap that its paid shows filled."
      },
      {
        "cause": "timing",
        "title": "It launched into lockdown",
        "text": "The pitch was TV for the commute and for waiting in line. With most people at home near large screens, a phone-only service had less to offer."
      },
      {
        "cause": "product",
        "title": "Clips could not spread",
        "text": "At launch, viewers could not screenshot or share clips, so the shows did not travel through social media. TV casting arrived months later."
      }
    ],
    "timeline": [
      {
        "when": "2018",
        "text": "Founded by Jeffrey Katzenberg and Meg Whitman. Investors commit about $1.75B before any show is released."
      },
      {
        "when": "Apr 2020",
        "text": "Launches in the US on 6 April, in the first weeks of Covid-19 lockdowns."
      },
      {
        "when": "2020",
        "text": "Adds TV casting after viewers ask for it. The founders look for a buyer and find none."
      },
      {
        "when": "Oct 2020",
        "text": "Founders announce the company will shut down."
      },
      {
        "when": "Dec 2020",
        "text": "The app stops working. Roku buys the content library in 2021."
      }
    ],
    "lesson": "Large budgets and famous names do not replace proof that people want the product."
  },
  {
    "id": "theranos",
    "name": "Theranos",
    "what": "Promised hundreds of blood tests from a few drops of blood taken with a finger prick.",
    "sector": "Health",
    "country": "US",
    "hq": "Palo Alto, California",
    "founded": 2003,
    "closedYear": 2018,
    "closedLabel": "Sep 2018",
    "raisedMillions": 700,
    "status": "Dissolved",
    "founders": [
      "Elizabeth Holmes"
    ],
    "investors": [
      "Draper Fisher Jurvetson",
      "Rupert Murdoch",
      "Walton family"
    ],
    "competitors": [
      "Quest Diagnostics",
      "Labcorp"
    ],
    "reasons": [
      {
        "cause": "fraud",
        "title": "Claims the technology could not support",
        "text": "Theranos said its device could run a wide range of tests from a finger prick. Staff and later investigators found it could not, and most tests were run on standard machines made by other companies."
      },
      {
        "cause": "product",
        "title": "Accuracy problems",
        "text": "Results from the device were unreliable. Regulators found serious problems at its labs, and in 2016 the company voided two years of results."
      },
      {
        "cause": "legal",
        "title": "Investigations and charges",
        "text": "The 2015 news report was followed by regulator sanctions, SEC fraud charges in 2018 and criminal convictions of Holmes and Ramesh Balwani."
      }
    ],
    "timeline": [
      {
        "when": "2003",
        "text": "Founded by Elizabeth Holmes at age 19."
      },
      {
        "when": "2013",
        "text": "Begins offering tests in Walgreens stores."
      },
      {
        "when": "Oct 2015",
        "text": "A Wall Street Journal investigation reports that the technology does not work as claimed."
      },
      {
        "when": "2016",
        "text": "Federal regulators sanction the lab and ban Holmes from the industry for two years. The company voids two years of results from its device."
      },
      {
        "when": "Sep 2018",
        "text": "Dissolves after the SEC charges Holmes and her former president with fraud."
      },
      {
        "when": "Jan 2022",
        "text": "Holmes is convicted on four counts of fraud and later sentenced to over 11 years."
      }
    ],
    "lesson": "If the core technology does not work, a good story will not make it work."
  },
  {
    "id": "juicero",
    "name": "Juicero",
    "what": "A Wi-Fi connected juicer, first priced at $699, that pressed single-serve packs of chopped produce.",
    "sector": "Hardware",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 2013,
    "closedYear": 2017,
    "closedLabel": "Sep 2017",
    "raisedMillions": 120,
    "status": "Shut down",
    "founders": [
      "Doug Evans"
    ],
    "investors": [
      "Google Ventures",
      "Kleiner Perkins"
    ],
    "competitors": [
      "Cold-press juice bars",
      "Home juicers"
    ],
    "reasons": [
      {
        "cause": "cost",
        "title": "A costly machine for a simple job",
        "text": "The press used custom parts and a lot of engineering to squeeze a bag. When people saw they could do the same by hand, the price of the machine looked unjustifiable."
      },
      {
        "cause": "market",
        "title": "High price, ongoing cost",
        "text": "The press was expensive and every glass needed a pack that cost several dollars. Buyers saw little reason to commit to that."
      }
    ],
    "timeline": [
      {
        "when": "2013",
        "text": "Founded by Doug Evans."
      },
      {
        "when": "2016",
        "text": "Launches the press at $699, with packs sold separately."
      },
      {
        "when": "Jan 2017",
        "text": "Cuts the price of the press to $399."
      },
      {
        "when": "Apr 2017",
        "text": "Bloomberg shows that the packs can be squeezed by hand with nearly the same result."
      },
      {
        "when": "Sep 2017",
        "text": "Stops selling and winds down."
      }
    ],
    "lesson": "Customers notice when expensive hardware solves a problem a simple tool already solves."
  },
  {
    "id": "webvan",
    "name": "Webvan",
    "what": "Online grocery delivery that built its own warehouses and delivery fleet.",
    "sector": "Delivery & Commerce",
    "country": "US",
    "hq": "Foster City, California",
    "founded": 1996,
    "closedYear": 2001,
    "closedLabel": "Jul 2001",
    "raisedMillions": 800,
    "status": "Bankrupt",
    "founders": [
      "Louis Borders"
    ],
    "investors": [
      "Sequoia Capital",
      "Benchmark",
      "Softbank",
      "Goldman Sachs"
    ],
    "competitors": [
      "Peapod",
      "HomeGrocer",
      "Supermarket chains"
    ],
    "reasons": [
      {
        "cause": "scale",
        "title": "Built for many cities before it had one",
        "text": "It committed about $1B to automated warehouses and trucks in many metro areas, based on order volumes it had not yet seen."
      },
      {
        "cause": "cost",
        "title": "Delivery economics",
        "text": "Grocery margins are thin. Low or no delivery fees meant many orders lost money, and growth made losses bigger."
      },
      {
        "cause": "timing",
        "title": "Customers were not there yet",
        "text": "In 1999 to 2001 few households ordered groceries online, so the warehouses were far from full."
      }
    ],
    "timeline": [
      {
        "when": "1996",
        "text": "Founded by Louis Borders."
      },
      {
        "when": "Jun 1999",
        "text": "Starts deliveries in the San Francisco Bay Area."
      },
      {
        "when": "Nov 1999",
        "text": "Goes public in a large IPO."
      },
      {
        "when": "2000",
        "text": "Merges with rival HomeGrocer and signs a deal worth about $1B to build automated warehouses."
      },
      {
        "when": "Jul 2001",
        "text": "Files for bankruptcy, less than two years after its IPO."
      }
    ],
    "lesson": "Prove the economics in a few cities before building for fifty."
  },
  {
    "id": "pets-com",
    "name": "Pets.com",
    "what": "Online store for pet food and supplies, known for its sock puppet mascot.",
    "sector": "Delivery & Commerce",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 1998,
    "closedYear": 2000,
    "closedLabel": "Nov 2000",
    "raisedMillions": 110,
    "status": "Liquidated",
    "founders": [
      "Greg McLemore"
    ],
    "investors": [
      "Amazon",
      "Bowman Capital"
    ],
    "competitors": [
      "Petco",
      "PetSmart",
      "Petopia"
    ],
    "reasons": [
      {
        "cause": "cost",
        "title": "Shipping heavy products at a loss",
        "text": "Pet food and litter are heavy and low margin, so many orders cost more to ship than the company earned on them."
      },
      {
        "cause": "scale",
        "title": "Brand spend before the business worked",
        "text": "It spent heavily on advertising and its mascot, more than it earned in sales, to win customers who each lost it money."
      },
      {
        "cause": "timing",
        "title": "The dot-com crash",
        "text": "Its IPO came just before the market fell. It could not raise more money and chose to liquidate."
      }
    ],
    "timeline": [
      {
        "when": "1998",
        "text": "Founded by Greg McLemore."
      },
      {
        "when": "Jan 2000",
        "text": "Runs a Super Bowl advertisement."
      },
      {
        "when": "Feb 2000",
        "text": "Goes public."
      },
      {
        "when": "Nov 2000",
        "text": "Announces it will liquidate, nine months after its IPO."
      }
    ],
    "lesson": "Growth does not help when every sale loses money."
  },
  {
    "id": "kozmo",
    "name": "Kozmo.com",
    "what": "One-hour delivery of snacks, movies and small goods in US cities.",
    "sector": "Delivery & Commerce",
    "country": "US",
    "hq": "New York, New York",
    "founded": 1997,
    "closedYear": 2001,
    "closedLabel": "Apr 2001",
    "raisedMillions": 280,
    "status": "Shut down",
    "founders": [
      "Joseph Park",
      "Yong Kang"
    ],
    "investors": [
      "Amazon",
      "Softbank"
    ],
    "competitors": [
      "UrbanFetch",
      "Local stores"
    ],
    "reasons": [
      {
        "cause": "cost",
        "title": "Free delivery on tiny orders",
        "text": "Delivery was free with no minimum, and a courier went out for each order, so many sales lost money."
      },
      {
        "cause": "scale",
        "title": "Expanded to many cities",
        "text": "It opened in more cities before the cost of a single delivery had been solved."
      },
      {
        "cause": "timing",
        "title": "The IPO window closed",
        "text": "Its planned IPO was withdrawn in 2000. Without public funding it could not keep covering losses."
      }
    ],
    "timeline": [
      {
        "when": "1997",
        "text": "Founded in New York by Joseph Park and Yong Kang."
      },
      {
        "when": "1999",
        "text": "Expands to more US cities."
      },
      {
        "when": "2000",
        "text": "Files for an IPO, then withdraws it in July as the market falls."
      },
      {
        "when": "Apr 2001",
        "text": "Shuts down."
      }
    ],
    "lesson": "Free delivery has to be paid for somewhere."
  },
  {
    "id": "jawbone",
    "name": "Jawbone",
    "what": "Maker of Bluetooth headsets, speakers and the UP fitness band.",
    "sector": "Hardware",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 1999,
    "closedYear": 2017,
    "closedLabel": "2017",
    "raisedMillions": 930,
    "status": "Liquidated",
    "founders": [
      "Hosain Rahman",
      "Alexander Asseily"
    ],
    "investors": [
      "Sequoia Capital",
      "Kleiner Perkins",
      "Andreessen Horowitz",
      "Khosla Ventures"
    ],
    "competitors": [
      "Fitbit",
      "Apple",
      "Garmin",
      "Bose"
    ],
    "reasons": [
      {
        "cause": "product",
        "title": "Reliability problems",
        "text": "Early UP bands had faults and were refunded. Later models improved, but the company never fully rebuilt trust with buyers."
      },
      {
        "cause": "compete",
        "title": "Larger rivals",
        "text": "Fitbit was cheaper and more focused, and Apple entered wearables in 2015, which squeezed the market for single-purpose bands."
      },
      {
        "cause": "cash",
        "title": "A cash drain",
        "text": "It raised about $930M in total, but returns, legal fights and falling sales used the money up before the products could recover."
      }
    ],
    "timeline": [
      {
        "when": "1999",
        "text": "Founded as AliphCom."
      },
      {
        "when": "2011",
        "text": "Launches the UP band. Early units have faults and the company refunds buyers."
      },
      {
        "when": "2015",
        "text": "Competes with Fitbit and the Apple Watch, and fights Fitbit in court over trade secrets."
      },
      {
        "when": "2017",
        "text": "Begins liquidating after it cannot raise more money."
      }
    ],
    "lesson": "Returns and recalls drain cash faster than a recovering product can earn it back."
  },
  {
    "id": "fab",
    "name": "Fab",
    "what": "Began as a daily design deals site, then became an online store for design goods.",
    "sector": "Delivery & Commerce",
    "country": "US",
    "hq": "New York, New York",
    "founded": 2010,
    "closedYear": 2015,
    "closedLabel": "Feb 2015",
    "raisedMillions": 330,
    "status": "Assets sold",
    "founders": [
      "Jason Goldberg",
      "Bradford Shellhammer"
    ],
    "investors": [
      "Andreessen Horowitz",
      "Atomico",
      "Menlo Ventures"
    ],
    "competitors": [
      "Wayfair",
      "Etsy",
      "Amazon"
    ],
    "reasons": [
      {
        "cause": "scale",
        "title": "Expanded faster than sales",
        "text": "It raised large rounds and opened in Europe and into making its own products before the core business worked."
      },
      {
        "cause": "focus",
        "title": "Changed direction repeatedly",
        "text": "The company moved from social network to flash sales, to online store, to its own products, with each change costing time and money."
      },
      {
        "cause": "cash",
        "title": "Spending outran revenue",
        "text": "Costs grew faster than sales, and by 2015 the company could not raise another round."
      }
    ],
    "timeline": [
      {
        "when": "2010",
        "text": "Founded as a social network, then changed direction in 2011 to flash sales of design goods."
      },
      {
        "when": "2013",
        "text": "Raises a $165M round at a valuation near $900M and expands to Europe."
      },
      {
        "when": "2014",
        "text": "Cuts most of its staff and changes strategy again."
      },
      {
        "when": "Feb 2015",
        "text": "Sold to PCH International for a small fraction of what it raised."
      }
    ],
    "lesson": "Each new market and product line multiplies cost before it proves itself.",
    "wikiQuery": "Fab.com"
  },
  {
    "id": "beepi",
    "name": "Beepi",
    "what": "A marketplace where owners sold used cars, with inspection and delivery handled by the company.",
    "sector": "Marketplace",
    "country": "US",
    "hq": "Mountain View, California",
    "founded": 2013,
    "closedYear": 2017,
    "closedLabel": "Early 2017",
    "raisedMillions": 150,
    "status": "Shut down",
    "founders": [
      "Ale Resnik",
      "Owen Tanjung"
    ],
    "investors": [
      "Redpoint Ventures"
    ],
    "competitors": [
      "Carvana",
      "CarMax",
      "Traditional dealers"
    ],
    "reasons": [
      {
        "cause": "cost",
        "title": "Every car was handled by hand",
        "text": "Inspecting, storing and moving each car was expensive, and margins on used cars are thin."
      },
      {
        "cause": "cash",
        "title": "No further funding",
        "text": "It could not raise another round on the valuation it had set, so it ran out of runway."
      },
      {
        "cause": "compete",
        "title": "Better funded rivals",
        "text": "Online car sellers such as Carvana and established dealers had cheaper ways to reach buyers."
      }
    ],
    "timeline": [
      {
        "when": "2013",
        "text": "Founded in Mountain View."
      },
      {
        "when": "2015",
        "text": "Raises money at a valuation of about $560M."
      },
      {
        "when": "2016",
        "text": "Faces rising costs and slowing growth."
      },
      {
        "when": "Early 2017",
        "text": "Shuts down after failing to raise another round."
      }
    ],
    "lesson": "A marketplace that handles every step itself carries the costs of a dealer without the margins."
  },
  {
    "id": "quirky",
    "name": "Quirky",
    "what": "Let members suggest product ideas, then designed, made and sold the winners.",
    "sector": "Hardware",
    "country": "US",
    "hq": "New York, New York",
    "founded": 2009,
    "closedYear": 2015,
    "closedLabel": "Sep 2015",
    "raisedMillions": 185,
    "status": "Bankrupt",
    "founders": [
      "Ben Kaufman"
    ],
    "investors": [
      "Andreessen Horowitz",
      "Kleiner Perkins",
      "GE"
    ],
    "competitors": [
      "Kickstarter",
      "Indiegogo",
      "Retail brands"
    ],
    "reasons": [
      {
        "cause": "focus",
        "title": "Too many products at once",
        "text": "The company made dozens of products across many categories, each needing design, tooling and marketing."
      },
      {
        "cause": "cost",
        "title": "Few hits to cover the misses",
        "text": "Most products did not sell enough to cover their development costs, and hardware tooling is expensive."
      },
      {
        "cause": "cash",
        "title": "Cash ran out",
        "text": "Spending ran ahead of revenue and it filed for bankruptcy in September 2015."
      }
    ],
    "timeline": [
      {
        "when": "2009",
        "text": "Founded by Ben Kaufman."
      },
      {
        "when": "2013",
        "text": "Partners with GE and launches the Wink connected home line."
      },
      {
        "when": "2014",
        "text": "Releases products at a fast pace across many categories."
      },
      {
        "when": "Sep 2015",
        "text": "Files for bankruptcy. Wink is sold during the process."
      }
    ],
    "lesson": "A few hits cannot pay for dozens of misses."
  },
  {
    "id": "homejoy",
    "name": "Homejoy",
    "what": "On-demand home cleaning booked online.",
    "sector": "Marketplace",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 2010,
    "closedYear": 2015,
    "closedLabel": "Jul 2015",
    "raisedMillions": 40,
    "status": "Shut down",
    "founders": [
      "Adora Cheung",
      "Aaron Cheung"
    ],
    "investors": [
      "Google Ventures",
      "Andreessen Horowitz",
      "Redpoint Ventures"
    ],
    "competitors": [
      "Handy",
      "Managed by Q",
      "TaskRabbit"
    ],
    "reasons": [
      {
        "cause": "model",
        "title": "Customers left after the first booking",
        "text": "Many customers booked once, then hired the same cleaner directly to avoid fees, so repeat revenue was low."
      },
      {
        "cause": "cost",
        "title": "Discounts to win customers",
        "text": "Deep first-booking discounts brought in new customers who then did not stay, so each one cost more than it earned."
      },
      {
        "cause": "legal",
        "title": "Worker classification lawsuits",
        "text": "Lawsuits over whether cleaners were employees or contractors added legal risk and cost."
      },
      {
        "cause": "cash",
        "title": "Investors held back",
        "text": "Concerns about retention and legal risk made it hard to raise the next round."
      }
    ],
    "timeline": [
      {
        "when": "2010",
        "text": "Founded by Adora and Aaron Cheung."
      },
      {
        "when": "2012",
        "text": "Launches the booking service."
      },
      {
        "when": "2014",
        "text": "Expands across the US and abroad."
      },
      {
        "when": "2015",
        "text": "Faces lawsuits over cleaners' employment status and struggles to raise money."
      },
      {
        "when": "Jul 2015",
        "text": "Announces it will shut down."
      }
    ],
    "lesson": "A marketplace needs a reason for both sides to keep using it after the first match."
  },
  {
    "id": "better-place",
    "name": "Better Place",
    "what": "Planned networks of battery swap stations for electric cars.",
    "sector": "Mobility",
    "country": "Israel",
    "hq": "Palo Alto, California, and Israel",
    "founded": 2007,
    "closedYear": 2013,
    "closedLabel": "May 2013",
    "raisedMillions": 850,
    "status": "Liquidated",
    "founders": [
      "Shai Agassi"
    ],
    "investors": [
      "HSBC",
      "Morgan Stanley",
      "Israel Corp",
      "GE"
    ],
    "competitors": [
      "Tesla",
      "Nissan Leaf",
      "Plug-in charging"
    ],
    "reasons": [
      {
        "cause": "scale",
        "title": "Infrastructure came before customers",
        "text": "It had to build swap stations and get carmakers to design swappable batteries, which cost far more than planned."
      },
      {
        "cause": "market",
        "title": "Few cars, few drivers",
        "text": "It sold roughly a thousand cars, mostly the Renault Fluence ZE, because drivers were wary of a car that depended on one company's network."
      },
      {
        "cause": "cost",
        "title": "Spent before it earned",
        "text": "It spent most of the roughly $850M it raised on stations and operations before it had enough customers."
      }
    ],
    "timeline": [
      {
        "when": "2007",
        "text": "Founded by Shai Agassi."
      },
      {
        "when": "2011",
        "text": "Opens its first battery-swap network in Israel and Denmark."
      },
      {
        "when": "Oct 2012",
        "text": "Agassi leaves the company."
      },
      {
        "when": "May 2013",
        "text": "Files for liquidation."
      }
    ],
    "lesson": "A product that needs new infrastructure also needs partners who agree to build for it."
  },
  {
    "id": "argo-ai",
    "name": "Argo AI",
    "what": "Self-driving technology backed by Ford and Volkswagen.",
    "sector": "Mobility",
    "country": "US",
    "hq": "Pittsburgh, Pennsylvania",
    "founded": 2016,
    "closedYear": 2022,
    "closedLabel": "Oct 2022",
    "raisedMillions": 3500,
    "status": "Shut down",
    "founders": [
      "Bryan Salesky",
      "Peter Rander"
    ],
    "investors": [
      "Ford",
      "Volkswagen"
    ],
    "competitors": [
      "Waymo",
      "Cruise",
      "Aurora"
    ],
    "reasons": [
      {
        "cause": "timing",
        "title": "Driverless cars took longer",
        "text": "Fully driverless cars proved harder and more expensive than backers expected, and a profitable service looked many years away."
      },
      {
        "cause": "cash",
        "title": "Two funders, both left",
        "text": "Argo depended on Ford and Volkswagen. When both decided to put money into other projects, it had no other source of funding."
      }
    ],
    "timeline": [
      {
        "when": "2016",
        "text": "Founded in Pittsburgh by former Google and Uber engineers."
      },
      {
        "when": "2017",
        "text": "Ford invests $1B."
      },
      {
        "when": "2019",
        "text": "Volkswagen invests about $2.6B."
      },
      {
        "when": "Oct 2022",
        "text": "Ford and Volkswagen stop funding it. Ford records a charge of about $2.7B."
      }
    ],
    "lesson": "Deep tech with one or two funders ends when they change their minds.",
    "wikiQuery": "Argo AI"
  },
  {
    "id": "convoy",
    "name": "Convoy",
    "what": "A digital freight marketplace that matched shippers with trucking companies.",
    "sector": "Mobility",
    "country": "US",
    "hq": "Seattle, Washington",
    "founded": 2015,
    "closedYear": 2023,
    "closedLabel": "Oct 2023",
    "raisedMillions": 900,
    "status": "Shut down",
    "founders": [
      "Dan Lewis",
      "Grant Goodale"
    ],
    "investors": [
      "Baillie Gifford",
      "CapitalG",
      "Y Combinator"
    ],
    "competitors": [
      "Uber Freight",
      "C.H. Robinson",
      "Transfix"
    ],
    "reasons": [
      {
        "cause": "timing",
        "title": "A freight downturn",
        "text": "Freight demand and prices fell after 2022, which cut shippers' spending and the fees the marketplace earned."
      },
      {
        "cause": "cash",
        "title": "Could not raise more",
        "text": "When the market turned, investors held back and the company could not raise the money it needed to continue."
      },
      {
        "cause": "compete",
        "title": "Large incumbents",
        "text": "Established freight brokers and Uber Freight could cut prices and carry losses longer."
      }
    ],
    "timeline": [
      {
        "when": "2015",
        "text": "Founded in Seattle."
      },
      {
        "when": "2022",
        "text": "Valued at about $3.8B after raising large rounds."
      },
      {
        "when": "2023",
        "text": "Freight demand and prices fall sharply."
      },
      {
        "when": "Oct 2023",
        "text": "Shuts down. Flexport later takes over its technology."
      }
    ],
    "lesson": "A business built on a hot market and easy money needs savings for the downturn.",
    "wikiQuery": "Convoy freight company"
  },
  {
    "id": "zume",
    "name": "Zume",
    "what": "Robot-assisted pizza cooked in delivery vans on the way to the customer.",
    "sector": "Food",
    "country": "US",
    "hq": "Mountain View, California",
    "founded": 2015,
    "closedYear": 2023,
    "closedLabel": "2023",
    "raisedMillions": 445,
    "status": "Shut down",
    "founders": [
      "Julia Collins",
      "Alex Garden"
    ],
    "investors": [
      "SoftBank"
    ],
    "competitors": [
      "Domino's",
      "Papa John's"
    ],
    "reasons": [
      {
        "cause": "cost",
        "title": "The idea did not lower costs",
        "text": "Cooking in vans needed ovens, drivers and special timing, and it did not make delivery cheaper or better for customers."
      },
      {
        "cause": "focus",
        "title": "Changed business after the pizza ended",
        "text": "Moving to packaging meant starting in a new industry, with new customers and new competitors."
      },
      {
        "cause": "cash",
        "title": "Funding stopped",
        "text": "Without a clear path to profit, it could not keep raising money after large early rounds."
      }
    ],
    "timeline": [
      {
        "when": "2015",
        "text": "Founded as a robotic pizza company."
      },
      {
        "when": "2018",
        "text": "SoftBank invests about $375M."
      },
      {
        "when": "2020",
        "text": "Ends its pizza delivery and shifts to food packaging."
      },
      {
        "when": "2023",
        "text": "Closes."
      }
    ],
    "lesson": "Automation only matters when customers can see or taste the difference."
  },
  {
    "id": "olive-ai",
    "name": "Olive AI",
    "what": "Automation software for hospital administrative work.",
    "sector": "Health",
    "country": "US",
    "hq": "Columbus, Ohio",
    "founded": 2012,
    "closedYear": 2023,
    "closedLabel": "Oct 2023",
    "raisedMillions": 900,
    "status": "Wound down",
    "founders": [
      "Sean Lane"
    ],
    "investors": [
      "General Catalyst",
      "Ascension Ventures",
      "Vertex"
    ],
    "competitors": [
      "R1 RCM",
      "Waystar",
      "Hospital in-house teams"
    ],
    "reasons": [
      {
        "cause": "scale",
        "title": "Grew too quickly",
        "text": "It hired quickly and added many product areas while still working out which ones customers would pay for."
      },
      {
        "cause": "focus",
        "title": "Too many products",
        "text": "The company spread across many hospital tasks, and each needed its own sales and customer support."
      },
      {
        "cause": "timing",
        "title": "Hospitals cut spending",
        "text": "As hospital budgets tightened in 2022 and 2023, customers cut the projects Olive depended on."
      }
    ],
    "timeline": [
      {
        "when": "2012",
        "text": "Founded in Columbus, Ohio."
      },
      {
        "when": "2021",
        "text": "Raises large rounds at a valuation above $4B."
      },
      {
        "when": "2023",
        "text": "Cuts about a third of its staff."
      },
      {
        "when": "Oct 2023",
        "text": "Announces it will wind down. Parts of the business are sold."
      }
    ],
    "lesson": "Get one product that customers pay for before adding more.",
    "wikiQuery": "Olive AI"
  },
  {
    "id": "builder-ai",
    "name": "Builder.ai",
    "what": "A UK company that sold app-building services it described as powered by AI.",
    "sector": "AI & Software",
    "country": "UK",
    "hq": "London",
    "founded": 2016,
    "closedYear": 2025,
    "closedLabel": "May 2025",
    "raisedMillions": 450,
    "status": "Insolvent",
    "founders": [
      "Sachin Dev Duggal"
    ],
    "investors": [
      "Microsoft",
      "Qatar Investment Authority"
    ],
    "competitors": [
      "Software agencies",
      "No-code tools"
    ],
    "reasons": [
      {
        "cause": "fraud",
        "title": "Overstated revenue",
        "text": "Reports in 2025 said that revenue and growth had been overstated to investors and lenders."
      },
      {
        "cause": "product",
        "title": "Technology did not match the description",
        "text": "Reports said much of the work was done by people and not by AI, which was how the service had been described."
      },
      {
        "cause": "cash",
        "title": "Lender took the cash",
        "text": "After lenders lost trust, one took control of the company's cash, which left it unable to pay its costs."
      }
    ],
    "timeline": [
      {
        "when": "2016",
        "text": "Founded in London, first as Engineer.ai."
      },
      {
        "when": "2023",
        "text": "Receives a large investment from Microsoft."
      },
      {
        "when": "Feb 2025",
        "text": "The founder steps back from the chief executive role."
      },
      {
        "when": "May 2025",
        "text": "A lender takes control of funds and the company enters insolvency."
      }
    ],
    "lesson": "Claims about your technology need to hold up when someone checks.",
    "wikiQuery": "Builder.ai"
  },
  {
    "id": "humane",
    "name": "Humane",
    "what": "A screenless wearable AI Pin sold for $699 plus a monthly subscription.",
    "sector": "Hardware",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 2018,
    "closedYear": 2025,
    "closedLabel": "Feb 2025",
    "raisedMillions": 230,
    "status": "Assets sold",
    "founders": [
      "Imran Chaudhri",
      "Bethany Bongiorno"
    ],
    "investors": [
      "Microsoft",
      "Sam Altman",
      "Marc Benioff"
    ],
    "competitors": [
      "Smartphones",
      "Rabbit R1"
    ],
    "reasons": [
      {
        "cause": "product",
        "title": "It was slow and unreliable",
        "text": "Reviewers found it slow, prone to overheating and often wrong, and its battery did not last."
      },
      {
        "cause": "compete",
        "title": "The phone already did the job",
        "text": "A smartphone could do almost everything the Pin did, with a screen, and customers already carried one."
      },
      {
        "cause": "cash",
        "title": "Sales were small",
        "text": "Sales fell well below plan, and the company sold for far less than it had hoped when it first sought a buyer."
      }
    ],
    "timeline": [
      {
        "when": "2018",
        "text": "Founded by two former Apple employees."
      },
      {
        "when": "Apr 2024",
        "text": "The AI Pin ships at $699 with a $24 monthly fee."
      },
      {
        "when": "2024",
        "text": "Reviewers call it slow and unreliable. The company looks for a buyer."
      },
      {
        "when": "Feb 2025",
        "text": "HP buys its assets for about $116M and the Pin stops working."
      }
    ],
    "lesson": "A new device has to be clearly better than the phone already in the customer's pocket.",
    "wikiQuery": "Humane Ai Pin"
  },
  {
    "id": "rdio",
    "name": "Rdio",
    "what": "Music streaming service founded by the people behind Skype.",
    "sector": "Media",
    "country": "US",
    "hq": "San Francisco, California",
    "founded": 2008,
    "closedYear": 2015,
    "closedLabel": "Nov 2015",
    "raisedMillions": 125,
    "status": "Bankrupt",
    "founders": [
      "Janus Friis",
      "Niklas Zennström"
    ],
    "investors": [
      "Cumulus Media"
    ],
    "competitors": [
      "Spotify",
      "Pandora",
      "Apple Music",
      "Rhapsody"
    ],
    "reasons": [
      {
        "cause": "compete",
        "title": "Spotify and Apple Music",
        "text": "Rivals had bigger audiences, larger marketing budgets and stronger deals with record labels."
      },
      {
        "cause": "cost",
        "title": "Music licensing",
        "text": "Music licences take most of a streaming service's revenue, so a service needs scale to earn a profit."
      },
      {
        "cause": "cash",
        "title": "Could not keep funding",
        "text": "With little growth and high costs it could not fund the gap and filed for bankruptcy."
      }
    ],
    "timeline": [
      {
        "when": "2008",
        "text": "Founded by Janus Friis and Niklas Zennström."
      },
      {
        "when": "2010",
        "text": "Launches in the US."
      },
      {
        "when": "2015",
        "text": "Apple Music launches and Rdio loses ground."
      },
      {
        "when": "Nov 2015",
        "text": "Files for bankruptcy. Pandora buys the assets for about $75M."
      }
    ],
    "lesson": "In a market where size is the advantage, being second and smaller rarely works."
  },
  {
    "id": "ouya",
    "name": "Ouya",
    "what": "A $99 Android game console funded by a record-setting Kickstarter in 2012.",
    "sector": "Hardware",
    "country": "US",
    "hq": "Santa Monica, California",
    "founded": 2012,
    "closedYear": 2015,
    "closedLabel": "2015",
    "raisedMillions": 25,
    "status": "Assets sold",
    "founders": [
      "Julie Uhrman"
    ],
    "investors": [
      "Kleiner Perkins",
      "Nvidia",
      "Mayfield Fund"
    ],
    "competitors": [
      "PlayStation",
      "Xbox",
      "Steam",
      "Mobile games"
    ],
    "reasons": [
      {
        "cause": "product",
        "title": "Weak hardware and games",
        "text": "Players found the controller and the game library weak, and most games were ports of mobile titles."
      },
      {
        "cause": "compete",
        "title": "Phones and big consoles",
        "text": "Phones and established consoles already had far better games and larger audiences."
      },
      {
        "cause": "market",
        "title": "Interest was not demand",
        "text": "The crowdfunding total showed interest in the idea, but not that people would keep buying and playing."
      }
    ],
    "timeline": [
      {
        "when": "Jul 2012",
        "text": "Raises about $8.6M on Kickstarter, a record at the time."
      },
      {
        "when": "2013",
        "text": "Ships to backers and goes on sale."
      },
      {
        "when": "2014",
        "text": "Struggles to attract hit games or players."
      },
      {
        "when": "2015",
        "text": "Razer buys its software and team."
      }
    ],
    "lesson": "A crowdfunding win measures interest in an idea. It does not measure what people will keep using."
  },
  {
    "id": "stayzilla",
    "name": "Stayzilla",
    "what": "Bengaluru-based marketplace for homestays and budget stays.",
    "sector": "Travel",
    "country": "India",
    "hq": "Bengaluru",
    "founded": 2005,
    "closedYear": 2017,
    "closedLabel": "Early 2017",
    "raisedMillions": 21,
    "status": "Shut down",
    "founders": [
      "Yogendra Vasupal"
    ],
    "investors": [
      "Matrix Partners India",
      "Nexus Venture Partners"
    ],
    "competitors": [
      "OYO",
      "MakeMyTrip",
      "Airbnb"
    ],
    "reasons": [
      {
        "cause": "cash",
        "title": "Investors stopped funding",
        "text": "The company ran short of money, and its backers did not put in more, so it could not continue."
      },
      {
        "cause": "compete",
        "title": "Better funded rivals",
        "text": "OYO and MakeMyTrip spent heavily on discounts and marketing, which a smaller company could not match."
      }
    ],
    "timeline": [
      {
        "when": "2005",
        "text": "Founded."
      },
      {
        "when": "2012",
        "text": "Reaches a wider audience as homestay and budget travel grows in India."
      },
      {
        "when": "2016",
        "text": "Faces much better funded rivals such as OYO and MakeMyTrip."
      },
      {
        "when": "Early 2017",
        "text": "Stops operating after about twelve years."
      }
    ],
    "lesson": "In a crowded market, a company with little cash ends when investors stop backing it.",
    "sources": [
      {
        "title": "PhocusWire",
        "url": "https://www.phocuswire.com/Well-backed-homestay-site-Stayzilla-shuts-down-after-12-years"
      }
    ]
  },
  {
    "id": "dunzo",
    "name": "Dunzo",
    "what": "Bengaluru-based delivery app that grew into quick commerce.",
    "sector": "Delivery & Commerce",
    "country": "India",
    "hq": "Bengaluru",
    "founded": 2015,
    "closedYear": 2024,
    "closedLabel": "2024",
    "raisedMillions": 500,
    "status": "Operations halted",
    "founders": [
      "Kabeer Biswas",
      "Ankur Agarwal",
      "Dalvir Suri",
      "Mukund Jha"
    ],
    "investors": [
      "Reliance Retail",
      "Google",
      "Lightbox"
    ],
    "competitors": [
      "Zepto",
      "Blinkit",
      "Swiggy Instamart"
    ],
    "reasons": [
      {
        "cause": "compete",
        "title": "Larger rivals spent more",
        "text": "Zepto, Blinkit and Swiggy Instamart spent heavily on dark stores and discounts that Dunzo could not match."
      },
      {
        "cause": "cash",
        "title": "Funding round fell through",
        "text": "A planned round in 2023 did not close, and the company's cash fell short."
      },
      {
        "cause": "cost",
        "title": "Quick delivery is costly",
        "text": "Fast delivery needs warehouses, riders and discounts, and the unit economics were not strong enough to fund themselves."
      }
    ],
    "timeline": [
      {
        "when": "2015",
        "text": "Founded in Bengaluru."
      },
      {
        "when": "2022",
        "text": "Raises a large round led by Reliance Retail."
      },
      {
        "when": "2023",
        "text": "A planned funding round falls through, and staff are laid off."
      },
      {
        "when": "2024",
        "text": "Salaries are delayed and operations shrink."
      }
    ],
    "lesson": "Fast delivery is a spending contest. Know how long your cash lasts against rivals who can outspend you."
  },
  {
    "id": "byjus",
    "name": "Byju's",
    "what": "Indian edtech company that sold learning apps and tuition.",
    "sector": "Edtech",
    "country": "India",
    "hq": "Bengaluru",
    "founded": 2011,
    "closedYear": 2024,
    "closedLabel": "Jul 2024",
    "raisedMillions": 5000,
    "status": "Insolvency case",
    "founders": [
      "Byju Raveendran",
      "Divya Gokulnath"
    ],
    "investors": [
      "Prosus",
      "Tiger Global",
      "General Atlantic",
      "Chan Zuckerberg Initiative"
    ],
    "competitors": [
      "Unacademy",
      "PhysicsWallah",
      "Vedantu"
    ],
    "reasons": [
      {
        "cause": "scale",
        "title": "Bought growth",
        "text": "It acquired many companies and grew fast, which added cost and complexity before the core business was stable."
      },
      {
        "cause": "legal",
        "title": "Disputes and unpaid dues",
        "text": "Delayed accounts, disputes with lenders and investors, and an unpaid sponsorship dispute led to insolvency proceedings."
      },
      {
        "cause": "cash",
        "title": "Could not cover costs",
        "text": "As sales slowed after the pandemic boom, it could not meet its costs and loan payments."
      }
    ],
    "timeline": [
      {
        "when": "2011",
        "text": "Founded in Bengaluru."
      },
      {
        "when": "2015",
        "text": "Launches the learning app."
      },
      {
        "when": "2022",
        "text": "Valued at about $22B at its peak, after buying many companies."
      },
      {
        "when": "2022",
        "text": "Delays its audited accounts, and disputes with investors and lenders begin."
      },
      {
        "when": "Jul 2024",
        "text": "Insolvency proceedings begin over unpaid dues."
      }
    ],
    "lesson": "Buying growth with borrowed money leaves little room when sales slow.",
    "wikiQuery": "Byju's"
  }
];
