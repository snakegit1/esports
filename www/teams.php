<?php

require './lib.php';

$riot['dev_key'] = 'RGAPI-ab1fd65b-d6fa-4c6a-a720-c8ad222e07a9';
$riot['region'] = 'NA1';
$riot['api_tpl']['summoner'] = 'https://'.strtolower($riot['region']).'.api.riotgames.com/lol/summoner/v3/summoners/by-name/{in_game_name}';
$riot['api_tpl']['matchlist'] = 'https://'.strtolower($riot['region']).'.api.riotgames.com/lol/match/v3/matchlists/by-account/{account_id}';
$riot['api_tpl']['match'] = 'https://'.strtolower($riot['region']).'.api.riotgames.com/lol/match/v3/matches/{match_id}';

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
function get_users() {
	return cache::getset('ds_users', function() {
		$ds = get_ds_client();
		foreach ($ds->runQuery($ds->query()->kind('profile')) as $v) {
			$v = obj2arr($v->get());
			ksort($v);
			$users[$v['user_id']] = $v;
		}
		return $users ?: [];
	});
}
function riot_api_get($type, $params = []) {
	global $riot;
	$url = $riot['api_tpl'][$type];
	foreach ($params as $k => $v) {
		$url = str_replace('{'.$k.'}', rawurlencode($v), $url);
	}
	return cache::getset('riot_'.$type.'_'.substr(md5($url),0,8), function() use ($url,$riot) {
		$out = file_get_contents($url, false, stream_context_create(['http' => [
			'method' => 'GET',
			'header' => 'X-Riot-Token: '.$riot['dev_key'],
		]]));
		return json_encode(json_decode($out, true), JSON_PRETTY_PRINT);
	});
}

$teams = get_teams();
$all_users = get_users();

$team_users = [];
foreach($teams as $tid => $v) {
	foreach ($v['user_ids'] as $uid) {
		$team_users[$uid] = $tid;
		$team_summoners[$uid] = $all_users[$uid]['in_game_name'];
	}
}

foreach ($team_summoners as $uid => $name) {
	$data = riot_api_get('summoner', ['in_game_name' => $name]);
	$data = json_decode($data, true);
	$aid = $data['accountId'];
	$account_ids[$uid] = $aid;
	if ($aid) {
		$data = riot_api_get('matchlist', ['account_id' => $aid]);
		$data = json_decode($data, true);
		$user_matches[$uid] = $data['matches'];
		$user_total_games[$uid] = $data['totalGames'];
	}
}

$team_shared_games = [];
foreach($teams as $tid => $v) {
	$tmp = [];
	foreach ($v['user_ids'] as $uid) {
		$matches = $user_matches[$uid];
	    foreach ($matches as $m) {
    	    $id = $m['gameId'];
        	$tmp[$uid][$id] = $id;
	    }
	}
	$team_shared_games[$tid] = call_user_func_array('array_intersect', $tmp);
}

$data = [];
foreach ($team_users as $uid => $team_id) {
	$data[$uid] = [
		'uid' => $uid,
		'team' => $teams[$team_id]['name'],
		'in_game_name' => $team_summoners[$uid],
		'account_id' => $account_ids[$uid],
		'total_games' => $user_total_games[$uid],
		'team_shared_games' => implode('<br>', $team_shared_games[$team_id] ?: null),
	];
}

html_out(
	html_table(obj2arr($data))
);

// https://matchhistory.na.leagueoflegends.com/en/#match-details/NA1/2717792680/31970218?tab=overview

/*
foreach(range(1,5) as $n) {
    $json[$n] = json_decode(file_get_contents('./'.$n.'.json'), true);
    foreach ($json[$n]['matches'] as $m) {
        $id = $m['gameId'];
        $games[$n][$id] = $m;
    }
}
print_r(array_intersect_key($games[1], $games[2], $games[3], $games[4], $games[5]));

#usr_0vYPQMamcC9saGWJCus8Rk | FoozleBamboozle | 218735506
#usr_0vYPLQksdXQZNXz6wsEX3P | l3igl3adl2ed | 210350272
#usr_0vYIzDnQh2bCLhGxGo3ku0 | ziggie | 226049620
*/
/*
https://developer.riotgames.com/api-methods/#lol-static-data-v3/GET_getChampionList
{
    "type": "champion",
    "version": "8.3.1",
    "data": {
        "MonkeyKing": {
            "title": "the Monkey King",
            "id": 62,
            "key": "MonkeyKing",
            "name": "Wukong"
        },
        "Jax": {
            "title": "Grandmaster at Arms",
            "id": 24,
            "key": "Jax",
            "name": "Jax"
        },
		...
*/
/*
https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName
{
    "profileIconId": 1390,
    "name": "Gelati",
    "summonerLevel": 51,
    "accountId": 31970218,
    "id": 19275741,
    "revisionDate": 1518579572000
}
*/
/*
https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/31970218?api_key=RGAPI-6d175309-513b-49e6-b2c0-a996f93625ae
{
    "matches": [
        {
            "lane": "MID",
            "gameId": 2716853671,
            "champion": 104,
            "platformId": "NA1",
            "timestamp": 1518406593639,
            "queue": 450,
            "role": "NONE",
            "season": 11
        },
        ...
*/
