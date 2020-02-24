// LYRIC INFO
const songList = {
  1: "First they knockin' now they hoppin', All on the wave 'cause they see me poppin', big-big large pockets, they start flockin', here's what I say when they ass keep knockin', my daddy said Trust no man but your brothers, And never leave your day one's in the gutter, My daddy said Treat young girls like your mother, my momma said Trust no hoe use a rubber".split(', '),
  2: "I'ma act, one, two, stop the track, Bring it back, what it do?, See Ricky said, Never let nobody get the one up on you, If they run up on you, hit 'em with a one, two, Or a bitch slap, leave the cul-de-sac, you're brothers gon' have your back regardless, And stick with your day one homies that was here before you started, And fear no man, but the man above your head, Pray before you got to bed, everything my momma said".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentElementId: null,
  elementsById: {
    1: {
      element: 'chorus',
      artist: 'Densel Curry',
      elementId: 1,
      elementArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      element: 'verse',
      artist: 'Densel Curry',
      elementId: 2,
      elementArray: songList[2],
      arrayPosition: 0,
    }
  }
};

// REDUX REDUCERS
const lyricChangeReduser = (state = initialState.elementsById, action) => {
  let newArrayPosition;
  let newElementsByIdEntry;
  let newElementsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LYRIC':
    let newArrayPosition = state[action.currentElementId].arrayPosition + 1;
    newElementsByIdEntry = Object.assign({}, state[action.currentElementId], {
      arrayPosition: newArrayPosition
    })
    newElementsByIdStateSlice = Object.assign({}, state, {
      [action.currentElementId]: newElementsByIdEntry
    });
    return newElementsByIdStateSlice;
    case 'RESTART_SONG':
    newElementsByIdEntry = Object.assign({}, state[action.currentElementId], {
      arrayPosition: 0
    })
    newElementsByIdStateSlice = Object.assign({}, state, {
      [action.currentElementId]: newElementsByIdEntry
    });
    return newElementsByIdStateSlice;
    default:
    return state;
  }
}

const elementChangeReducer = (state = initialState.currentElementId, action) => {
  switch (action.type){
    case 'CHANGE_ELEMENT':
    return action.newSelectedElementId
    default:
    return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentElementId: elementChangeReducer,
  elementsById: lyricChangeReduser
});

// REDUX STORE
const { createStore } = Redux;
const store = createStore(rootReducer);
console.log(store.getState());

// JEST TESTS + SETUP
const { expect } = window;

expect(lyricChangeReduser(initialState.elementsById, { type: null })).toEqual(initialState.elementsById);

expect(lyricChangeReduser(initialState.elementsById, { type: 'NEXT_LYRIC', currentElementId: 2 })).toEqual({
  1: {
    element: 'chorus',
    artist: 'Densel Curry',
    elementId: 1,
    elementArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    element: 'verse',
    artist: 'Densel Curry',
    elementId: 2,
    elementArray: songList[2],
    arrayPosition: 1,
  }
});

expect(lyricChangeReduser(initialState.elementsById, { type: 'RESTART_SONG', currentElementId: 1 })).toEqual({
  1: {
    element: 'chorus',
    artist: 'Densel Curry',
    elementId: 1,
    elementArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    element: 'verse',
    artist: 'Densel Curry',
    elementId: 2,
    elementArray: songList[2],
    arrayPosition: 0,
  }
});

expect(elementChangeReducer(initialState.currentElementId, { type: 'CHANGE_ELEMENT', newSelectedElementId: 1 })).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);
expect(store.getState().currentElementId).toEqual(elementChangeReducer(undefined, { type: null }));
expect(store.getState().elementsById).toEqual(lyricChangeReduser(undefined, { type: null }));


// RENDERING STATE IN DOM
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentElementId) {
    const currentLine = document.createTextNode(store.getState().elementsById[store.getState().currentElementId].elementArray[store.getState().elementsById[store.getState().currentElementId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectElementMessage = document.createTextNode('Select a part of the song from the menu above to mumble.');
    document.getElementById('lyrics').appendChild(selectElementMessage);
  }
}
const renderElements = () => {
  console.log('renderElements method successfully fired!!!');
  console.log(store.getState());
  const elementsById = store.getState().elementsById;
  for (const elementKey in elementsById) {
    const element = elementsById[elementKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const elementElement = document.createTextNode(element.element);
    const elementArtist = document.createTextNode(' by ' + element.artist);
    em.appendChild(elementElement);
    h3.appendChild(em);
    h3.appendChild(elementArtist);
    h3.addEventListener('click', function() {
      selectElement(element.elementId);
    });
    li.appendChild(h3);
    document.getElementById('elements').appendChild(li);
  }
}

window.onload = function() {
  renderElements();
  renderLyrics();
}

// CLICK LISTENERS

const userClick = () => {
  if (store.getState().elementsById[store.getState().currentElementId].arrayPosition === store.getState().elementsById[store.getState().currentElementId].elementArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG',
    currentElementId: store.getState().currentElementId });
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
    currentElementId: store.getState().currentElementId });
  }
}

const selectElement = (newElementId) => {
  let action;
  if (store.getState().currentElementId) {
    action = {
      type: 'RESTART_SONG',
      currentElementId: store.getState().currentElementId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_ELEMENT',
    newSelectedElementId: newElementId
  }
  store.dispatch(action);
}

// SUBSCRIBE TO REDUX STORE
store.subscribe(renderLyrics);
