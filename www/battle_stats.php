<?php

require './lib.php';

function get_teams() {
	return cache::getset('ds_teams', function() {
		$ds = get_ds_client();
		foreach ($ds->runQuery($ds->query()->kind('team')) as $v) {
			$v = obj2arr($v->get());
			ksort($v);
			$teams[$v['id']] = $v;
		}
		return $teams ?: [];
	});
}

function get_battles(){
	$ds = get_ds_client();
	foreach ($ds->runQuery($ds->query()->kind('battles')) as $v) {
		$v = obj2arr($v->get());
		ksort($v);
		$battles[$v['battle_id']] = $v;
	}
	return $battles ?: [];
}

function get_matches(){
	return cache::getset('ds_matches', function() {
		$ds = get_ds_client();
		foreach ($ds->runQuery($ds->query()->kind('matches')) as $v) {
			$v = obj2arr($v->get());
			ksort($v);
			$matches[$v['id']] = $v;
		}
		return $matches ?: [];
	});
}

$teams = get_teams();
$battles = get_battles();
$matches = get_matches();
//print_r($matches);exit;

$battles_info = [];
$team_stats = [];
foreach($battles as $k => $v){
	if($matches[$v['match_id']]['side_1'] == $v['win_team_id']) {
		$team_stats[$teams[$matches[$v['match_id']]['side_1']]['name']] += 1;
		$team_stats[$teams[$matches[$v['match_id']]['side_2']]['name']] += 0;
	}else{
		$team_stats[$teams[$matches[$v['match_id']]['side_1']]['name']] += 0;
		$team_stats[$teams[$matches[$v['match_id']]['side_2']]['name']] += 1;
	}
	$url = 'https://matchhistory.na.leagueoflegends.com/en/#match-details/NA1/'.$v['lol_battle_id'].'?tab=overview';
	$battles_info[$k] = [
//		'id'        => $k,
		'match_id'  => $v['match_id'],
		'dates'     => $matches[$v['match_id']]['first_date'].' - '.$matches[$v['match_id']]['last_date'],
		//		'lol_match' => $v['lol_battle_id'],
		'side1'     => $teams[$matches[$v['match_id']]['side_1']]['name'],
		'side2'     => $teams[$matches[$v['match_id']]['side_2']]['name'],
		'team1'     => implode(', ', $v['team1_players']),
		'team2'     => implode(', ', $v['team2_players']),
		'win_team'  => '<a href="'.$url.'" target="_blank">'.$teams[$v['win_team_id']]['name'].'</a>',
		'division'  => $teams[$v['win_team_id']]['division'],
	];
}
uasort($team_stats, function($a, $b) {
	return ($a > $b) ? -1 : 1;
});

foreach($team_stats as  $key => $val){
	$total[] = [
		'team' => $key,
		'wins' => $val,
	];
}
uasort($battles_info, function($a, $b) {
	return (intval($a['match_id']) < intval($b['match_id'])) ? -1 : 1;
});

$table_stats = html_table(obj2arr($total));
html_out(
	html_table(obj2arr($battles_info)).'<br />'.$table_stats
);
//print_r($battles_info);exit;
