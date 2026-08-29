(function(){
  if(window.VitrinOkeyEngine)return;

  const COLORS=['red','yellow','blue','black'];

  function createTileSet(){
    const tiles=[];
    let id=1;
    for(let copy=1;copy<=2;copy++){
      for(const color of COLORS){
        for(let number=1;number<=13;number++){
          tiles.push({id:'t'+(id++),color,number,copy,type:'normal'});
        }
      }
    }
    tiles.push({id:'fake1',type:'fake-joker'});
    tiles.push({id:'fake2',type:'fake-joker'});
    return tiles;
  }

  function shuffle(input){
    const a=input.slice();
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function nextNumber(n){
    return n===13?1:n+1;
  }

  function chooseIndicator(deck){
    const index=deck.findIndex(t=>t.type==='normal');
    if(index<0)throw new Error('Gösterge seçilemedi.');
    const indicator=deck[index];
    deck.splice(index,1);
    return indicator;
  }

  function jokerFromIndicator(indicator){
    return {color:indicator.color,number:nextNumber(indicator.number)};
  }

  function markJokers(tiles,joker){
    return tiles.map(t=>{
      if(t.type==='fake-joker')return {...t,isFakeJoker:true,isJoker:false};
      return {...t,isJoker:t.color===joker.color&&t.number===joker.number};
    });
  }

  function startGame(playerIds,dealerIndex=0){
    if(!Array.isArray(playerIds)||playerIds.length!==4)throw new Error('Okey 4 oyuncu ile başlar.');
    const ids=[...new Set(playerIds)];
    if(ids.length!==4)throw new Error('Oyuncular benzersiz olmalıdır.');

    const deck=shuffle(createTileSet());
    const indicator=chooseIndicator(deck);
    const joker=jokerFromIndicator(indicator);
    const marked=markJokers(deck,joker);
    const hands={};
    ids.forEach(id=>hands[id]=[]);

    let cursor=0;
    for(let round=0;round<14;round++){
      for(const id of ids)hands[id].push(marked[cursor++]);
    }
    const dealer=ids[((dealerIndex%4)+4)%4];
    hands[dealer].push(marked[cursor++]);

    return {
      version:1,
      status:'playing',
      players:ids,
      dealer,
      turn:dealer,
      indicator,
      joker,
      hands,
      deck:marked.slice(cursor),
      discardPile:[],
      winner:null,
      startedAt:new Date().toISOString()
    };
  }

  function drawTile(state,playerId){
    if(state.status!=='playing')throw new Error('Oyun aktif değil.');
    if(state.turn!==playerId)throw new Error('Sıra bu oyuncuda değil.');
    if(!state.deck.length)throw new Error('Çekilecek taş kalmadı.');
    const tile=state.deck.shift();
    state.hands[playerId].push(tile);
    return tile;
  }

  function discardTile(state,playerId,tileId){
    if(state.status!=='playing')throw new Error('Oyun aktif değil.');
    if(state.turn!==playerId)throw new Error('Sıra bu oyuncuda değil.');
    const hand=state.hands[playerId]||[];
    const index=hand.findIndex(t=>t.id===tileId);
    if(index<0)throw new Error('Taş oyuncunun elinde değil.');
    const tile=hand.splice(index,1)[0];
    state.discardPile.push({playerId,tile,at:new Date().toISOString()});
    const i=state.players.indexOf(playerId);
    state.turn=state.players[(i+1)%state.players.length];
    return tile;
  }

  function cloneState(state){
    return JSON.parse(JSON.stringify(state));
  }

  window.VitrinOkeyEngine={
    COLORS,
    createTileSet,
    shuffle,
    jokerFromIndicator,
    startGame,
    drawTile,
    discardTile,
    cloneState
  };
})();
