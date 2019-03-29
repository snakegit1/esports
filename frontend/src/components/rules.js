import React from 'react'

import './rules.css'

const Rules = () => {
	return (
		<div id="rules">
			<div className="container mt-5">
			<h1>League Rules</h1>
			<h2 className="h-color mt-4">WELCOME, FIRST RULE</h2>
			<p>Our goal is to help you improve and to provide everyone with a better LoL experience. Hence our first and most important rule:</p>
			<h2 className="bold center">NO FLAMING!</h2>
			Sportsmanship issues or other actions taken that negatively affect the community are grounds for DQ in a game and/or for expulsion from the league. All decisions made by League Office are final.
			<h2 className="h-color mt-4">TOOLS AND RESOURCES</h2>
			<p className="italic">Chat: Hipchat</p>
			<p>Hipchat has both private and public channels. Here are some of the more noteworthy ones:</p>
			<p>#<span className="bold">general</span> – this channel is for League announcements. PLEASE DO NOT POST HERE.</p>
			<p>#<span className="bold">random</span> – everything goes here!</p>
			<p>#<span className="bold">sub-channel</span> – when a player can’t make a match, the sub opportunity will be posted in this channel. Even if you’re not on a team yet, you can sub in for another team’s match.</p>
			<p>#<span className="bold">t-[your-team-name]</span> – this is your team channel for strategy sessions, game planning, scheduling practices, and communicating a lot.</p> 
			<p>#<span className="bold">m-[your-team]-v-[opponent]</span> – these are your weekly matchup channels for scheduling with opponents, identifying subs and proxy picks during drafts, and friendly, good-natured, and appropriate trash-talking/meme wars.</p>
			<h2 className="h-color mt-4">LEAGUE SCHEDULE/FORMAT</h2>
			<p>The Esports Amateur League consists of a five-week regular season followed by a “championship week.” Seeding for championship week will be determined using your regular season record. The first tiebreaker is head-to-head record.</p>
			<p>Each team will play one series per week, and the series time defaults to 6:00pm PT/9:00 pm ET on Tuesday. Each series will be two games, and the wins and losses will be tallied up to determine your team’s record.</p>
			<p>We will create chat matchup channels for all of the matchups in advance, and each member of both teams will be invited.</p>
			<p className="italic">Rescheduling</p>
			<p>Above all, The Esports Amateur League is a community that supports each other, so please be as flexible as possible to reschedule with an opponent if the default time doesn’t work.</p>
			<p><span  className="bold italic">All rescheduling should be done in the matchup channel (or by direct message if the matchup channel has not yet been created) between the team captains.</span> What this means is that the team captains for each team confirm new potential times with their teams in their own team channels and then confirm the rescheduling with the other team captain in the matchup channel. This avoids confusion of too many voices trying to schedule different times.</p>
			<p className="h-color italic bold">→ Notify a player advocate (i.e., @mark) as soon as a match is rescheduled so that the schedule can be edited to reflect the change.</p>
			<p className="italic">Substitutes</p>
			<p>If a new time cannot be worked out to allow all players to play, the team captain needs to post in the #sub-channel to find a sub. All players on the team should also ping their friend/contact lists to see if any suitable players would like to try out Vantage League.</p>
			<p>Suitable substitute (regular season) = within two divisions of the player needing a substitute.</p>
			<p>Suitable substitute (champ week) = within two divisions of the player needing a substitute AND played at least 1 game on any team during the regular season (includes players on teams that didn’t make the playoffs)</p>
			<p className="h-color italic bold">→ Notify a player advocate  (i.e., @mark) as soon as you’ve found a sub so that the roster can be edited to reflect the change.</p>
			<p className="italic">Proxy Picks</p>
			<p>Since league members may not own all champions, we permit proxy picking. To pick by proxy, just <span className="bold">select a random, seldom-used champion</span> (e.g., Urgot), and then post in the matchup channel which champion the proxy pick represents. For example, if I want to pick Zac for my team’s jungle first, but I don’t own Zac, I would simply type “Urgot = Zac” in the matchup channel before or as I lock in my selection.</p> 
			<p>Following completion of the full draft, the support for your team should quit the draft. The player quitting will need to be reinvited to the game. Immediately relaunch the draft and keep the same bans. All players now select their own champions and the same ones selected in the proxy draft.</p>
			<h2 className="h-color mt-4">TECHNICAL FOULS AND FORFEITS</h2>
			<p>A technical foul results in 1 ban being taken away from your team for the first match of the series. You can earn a technical foul in the following ways:</p>
			<ul>
				<li>Being late for your match. If you are 7 or more minutes late, you will be given a technical foul. For example, if the game starts at 6:00pm …</li>
				<li>– You arrive between 6:00 and 6:07pm, no technical foul.</li>
				<li>– If you arrive at 6:08pm or later, you’ll be given a technical foul. <span className="bold">If a player is 15 minutes late, that player will be disqualified. If the team can find a substitute within the next 5 minutes, then the team will be able to play without any bans for the first match.</span> If the team cannot find a substitute during that time, the team will forfeit the match. Note that while the official match will be forfeited, teams are encouraged to practice together anyway during the scheduled time.</li>
				<li>Time between games will be limited to 7 minutes after the game ends. If someone takes longer than 7 minutes, the team will be assessed a technical foul.</li>
				<li>You must notify your team captain at least 24 hours in advance if you need a sub. If you don’t do this, your team will be assessed a technical foul. Special situations will be permitted.</li>
			</ul>

			<h2 className="h-color mt-4">PREGAME</h2>
			<p>The home team (i.e., the team listed second on each matchup page) chooses sides for game 1; in game 2, the teams switch sides.</p>
			<p>The custom match must be a <span className="bold">Tournament Draft</span> to allow for pausing. Also, it must have <span className="bold">All Spectators Allowed</span> so that we can analyze the match.</p>
			<p>Both teams should arrange themselves in the following order in the lobby:</p>
			<p>TOP</p>
			<p>JGL</p>
			<p>MID</p>
			<p>ADC</p>
			<p>SUP</p>
			<p className="mb-5">Lane swapping is allowed at any point in time – pregame, during the pick/ban phase, and once the game has begun.</p>
			</div>
		</div>
	)
}

export default Rules