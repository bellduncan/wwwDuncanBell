async function getDirectLineToken() {
    const res = await fetch('/api/direct-line-token/', {method: 'POST',});

    if (!res.ok) {
      throw new Error(`Failed to get Direct Line token due to ${res.status}`);
    }

    return await res.json();
  }
  

  (async function() {
    // const res = await fetch("/api/secret/");
    // const thesecret = await res.json();
    
    const directLineTokenResponse = await getDirectLineToken();   // contains userId and token attributes
    
    // Use a customized store to add hooks to connect event
    const store = window.WebChat.createStore({}, ({ dispatch }) => next => action => {
      if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
        // When we receive DIRECT_LINE/CONNECT_FULFILLED action, we will send an event activity using WEB_CHAT/SEND_EVENT
        // This will help to override the default welcome message...
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'webchat/join',
            value: { language: window.navigator.language }
          }
        });
      }
      
      if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
        if (action.payload.activity.type = 'message') {
          const msgText = action.payload.activity.text; 
          
          if (msgText ==  WEBCHAT_DEFAULT_WELCOME_MESSAGE) {
            // override the welcome message
            action.payload.activity.text = WEBCHAT_OVERRIDE_WELCOME_MESSAGE;
          }
        }
      }

      return next(action);
    });


  window.WebChat.renderWebChat({
    directLine: window.WebChat.createDirectLine({ token: directLineTokenResponse.token }),
    store: store,
    styleSet: styleSet,
    styleOptions: styleOptions,
    locale: 'en-GB',

    // https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#text-to-speech
    //selectVoice: ( voices, activity ) => voices.find( ( { name } ) => /SoniaNeural/iu.test( name ) ),    // doesn't work :-(
    // webSpeechPonyfillFactory: window.WebChat.createBrowserWebSpeechPonyfillFactory(),  // doesn't work well on mobile devices (input never ends) so disabling
    
    overrideLocalizedStrings: {
      TEXT_INPUT_PLACEHOLDER: WEBCHAT_OVERRIDE_TEXT_PROMPT
    }
  }, 
  document.getElementById('webchat')
  );

  document.querySelector('#webchat > *').focus(); // Note: this doesn't seem to work on Chrome on Mac OSX?
})().catch(err => console.error(err));
