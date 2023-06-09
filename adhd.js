const voiceflowRuntime = 'general-runtime.voiceflow.com';
const voiceflowVersionID =
  document.getElementById('vfassistant').getAttribute('data-version') ||
  'production';
const voiceflowAPIKey = 'VF.DM.648b1f8b4e167a0006e6ca02.92Smb3llozQBrN8n';
//'VF.DM.6467711ca004290007e03187.CeRUE3bBEfepcTfz';

const input = document.getElementById('user-input');
const responseContainer = document.getElementById('response-container');
const inputPlaceholder = document.getElementById('input-placeholder');
const inputFieldContainer = document.getElementById('input-container');
const buttons = document.getElementById('buttons');
const lineSpacing = document.getElementById('linespacing');
const typeWriter = document.getElementById("typewriter");
const charSpacing = document.getElementById('charspacing');

const texttoSpeech = document.getElementById('texttospeech');
const synth = window.speechSynthesis;

const Font = document.getElementById('change_font');
const bionic = document.getElementById('bionic');
const voicebutton = document.getElementById('voice-button');
const voiceResponse = document.getElementById("voiceresponse");
const voiceContainer = document.getElementById('column_right');
const bulletPoints = document.getElementById('bulletpoints');
const adhdFeatures = document.getElementById('ADHD');
const dyslexiaFeatures = document.getElementById('Dyslexia');
const autismFeatures = document.getElementById('Autism')
const Highlighter = document.getElementById('highlighter');
const Speedbutton = document.getElementById("openspeed");
const Slower = document.getElementById('slower');
const Pause = document.getElementById('pause');
const Faster = document.getElementById('faster');

// Global variables to determine the speed of the text animation
let charDelay = 50;
let voicespeed = 1.2;
let paused = false;
let timeouts = [];

function bionicReading() {
  const articleElement = document.querySelector('[data-bionic-reading]')

  if (!articleElement) {
    return
  }

  const articleElements = [
    ...articleElement.querySelectorAll(
      'p, a, li, blockquote'
    ),
  ]
}



async function getVoiceFlowData(uniqueId, body) {
  let response = await fetch(`https://${voiceflowRuntime}/state/user/${uniqueId}/interact/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: voiceflowAPIKey,
      versionID: voiceflowVersionID,
    },
    body: JSON.stringify(body),
  });
  let data = await response.json();
  console.log('getVoiceFlowData:', data);
  return data;
}

// Send user input to Voiceflow Dialog API
async function interact(input, uniqueId) {
  let body = {
    config: { tts: true, stripSSML: true },
    action: { type: 'text', payload: input },
  }
 
  if (input === 'slower') {
    charDelay += 20;
  } else if (input === 'faster') {
    if (charDelay <= 0) return;
    charDelay -= 20;
  } else if (input === 'pause') {
    paused = true;
  } else if (input === 'resume') {
    paused = false;
  } else if (input === 'launch') {
    body = {
      config: { tts: true, stripSSML: true },
      action: { type: 'launch' },
    };
    let data = await getVoiceFlowData(uniqueId, body);
    displayResponse(data);
 
  } else {
    let data = await getVoiceFlowData(uniqueId, body);
    displayResponse(data);
  }
}

  document.getElementById("slower").onclick = () => {
      voicespeed -= .2
      console.log("message rate: ", voicespeed)
  }
  document.getElementById("faster").onclick = () => {
      voicespeed += .2
      console.log("message rate: ", voicespeed)
  }
let final_transcript = "";
let voice = false;

if ("webkitSpeechRecognition" in window) {

  let speechRecognition = new webkitSpeechRecognition();
  let resultIndex = 0;
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "English"
  

  speechRecognition.onresult = (event) => {
  // Create the interim transcript string locally because we don't want it to persist like final transcript
    let interim_transcript = "";
  
  // Loop through the results from the speech recognition object.
    for (let i = event.resultIndex; i < event.results.length; ++i) {
  // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
      if (event.results[i].isFinal) {
      final_transcript += event.results[i][0].transcript;
      console.log ("transcript:", final_transcript);
      } else {
      interim_transcript += event.results[i][0].transcript;
  }

  document.getElementById('user-input').innerHTML = final_transcript;
  const uniqueId = generateUniqueId();
  userInput = final_transcript;
  interact(userInput, uniqueId);
  final_transcript = "";
};

}

document.getElementById("voice-button").onclick = () => {
  if (voice === false) {
    // Start the Speech Recognition
    console.log("speech recognition active")
    speechRecognition.start();
    voice =true;
  } else if (voice ===true){
    console.log("speech recognition stopped")
    speechRecognition.stop();
    voice = false;
    let final_transcript = "";
  }
  };

} else {
  console.log("Speech Recognition Not Available");
}

function enableADHD(){
  if(adhdFeatures.checked){
    document.getElementById("adhdFeatures").style.border = "1px dotted limegreen";
    typeWriter.checked = true;
  }else{
    document.getElementById("adhdFeatures").style.border = "none";
    typeWriter.checked = false;
  }
  }
  


function enableDyslexia(){
  if (dyslexiaFeatures.checked){
    console.log('dyslexia features enabled')
    document.getElementById("dyslexiaFeatures").style.border = "1px dotted limegreen";
    lineSpacing.checked = true;
    charSpacing.checked = true;
    voiceResponse.checked = true;
    texttoSpeech.checked = true;
  } else{
    document.getElementById("dyslexiaFeatures").style.border = "none";
    lineSpacing.checked = false;
    charSpacing.checked = false;
    voiceResponse.checked = false;
    texttoSpeech.checked = false;
  }
}

function enableAutism(){
  if (autismFeatures.checked){
    document.getElementById("autismFeatures").style.border = "1px dotted limegreen";
    bulletPoints.checked = true;  
  } else{
    document.getElementById("autismFeatures").style.border = "none";
    bulletPoints.checked = false;  
  }
}
 function linespacing() {
  if (lineSpacing.checked) {
    document.getElementById('response-container').classList.add('line-spacing-class');
    console.log('line spacing: 2');
  } else {
    document.getElementById('response-container').classList.remove('line-spacing-class');
    console.log('line spacing: 1');
  }
}

function charspacing() {
  if (charSpacing.checked) {
    document.getElementById('response-container').classList.add('char-spacing-class');
    console.log('char spacing: 1.5');
  } else {
    document.getElementById('response-container').classList.remove('char-spacing-class');
    console.log('char spacing: 1');
  }
}

function changeFont(){
  if(Font.checked){
    responseContainer.style.fontFamily="OpenDyslexic";
  }else{
    responseContainer.style.fontFamily= "Open Sans", "sansSerif";
    responseContainer.style.fontWeight= "300";
  }

  }

function bulletpoints(){
        if (bulletPoints.checked){
          Input = "bullet points";
          const uniqueId = generateUniqueId();
  
          interact(Input, uniqueId);
          Input= "";
        }  
      
}


   

function voiceresponse(){
  if (voiceResponse.checked){
    voicebutton.style.opacity='1';
     console.log('voice button');
  }
  else if (!voiceResponse.checked){
    voicebutton.style.opacity='0';

  }
}


function displayResponse(response) {
  console.log(response)
  // Fade out previous content
  responseContainer.style.opacity = '0';


  // Clear timeouts, so old text doesn't appear
  for (var i=0; i<timeouts.length; i++) {
    clearTimeout(timeouts[i]);
  }

  let currentIndex = 0;
  let itemIndex = 0;
  let buttonarray = [];
  let paragraphIndex = 0; 
  j=0;

  // Clear responseContainer and button container from previous content
  while (responseContainer.firstChild) {
    responseContainer.removeChild(responseContainer.firstChild);
  }
  while (buttons.firstChild) {
    buttons.removeChild(buttons.firstChild);
  }

  

  async function displayNextCharacter() {
    if (itemIndex === response.length) return;
    
    while (paused) {
      console.log('paused');
      await sleep(100);
    }

    const item = response[itemIndex];
    if(item.type !== 'text') {
      itemIndex++;
    } else if (item.type === "text" && typeWriter.checked) {
      if (paragraphIndex<=6) {
        const textElement = responseContainer.children[paragraphIndex];
        const text = item.payload.message[currentIndex];
        textElement.textContent += text;
        currentIndex++;
      }
      
      if (currentIndex === item.payload.message.length) {
        currentIndex = 0;
        itemIndex++;
        paragraphIndex++;
        if (paragraphIndex >= 6) {
          if (responseContainer.firstChild) {
           await sleep(3000)
           responseContainer.removeChild(responseContainer.firstChild);
           responseContainer.innerHTML = ' '
        }
          paragraphIndex=0;
        }
        if (itemIndex < response.length && response[itemIndex].type === 'text') {
          //responseContainer.appendChild(document.createElement('p'));
          const newParagraph = document.createElement('p');
        }
          
      }
    }
  
    timeouts.push(setTimeout(displayNextCharacter, charDelay));
  }

  // Fetch VF DM API response
  if(response){
    console.log(response)
  if (Array.isArray(response)) {
    for(let item of response) {
      if (item.type === 'text') {
        if (typeWriter.checked) {
          bionic.checked = false;

          const textElement = document.createElement('p');
          responseContainer.appendChild(textElement);
          textElement.style.display = 'inline-block';
          responseContainer.style.opacity = '1';
        }
        if (texttoSpeech.checked){
            //document.getElementsbyClassName("openspeed").style.opacity = "1";
            const textElement = document.createElement('p');
            textElement.textContent = item.payload.message;
            var voices = window.speechSynthesis.getVoices();
            const msg = new SpeechSynthesisUtterance(textElement.textContent);
            msg.voice =  voices[50];
            msg.voiceURI = "native";
            msg.lang = "en-US";
            voicespeed = msg.rate;
            console.log(msg.rate)
            msg.pitch = 0.8;

            let speech_paused = false;

            speechSynthesis.speak(msg);
          
            document.getElementById("pause").onclick = () => {

              if (speech_paused === false){
                speechSynthesis.pause();
                speech_paused = true;
              } else if(speech_paused === true){
                speechSynthesis.resume();
              }
             
            }

        }
          
        if (bionic.checked) {
            console.log("bionic on")
            typeWriter.checked = false;
            const textElement = document.createElement('p');
            const textarray = item.payload.message.split(' ');
            const textarrayBold = textarray.map((textWord) => {
              const wordLength = textWord.length;
              if (wordLength === 1) {
                return `<strong>${textWord}</strong>`;
              }
              const wordLengthHalf = Math.ceil(wordLength / 2);

              const wordArray = textWord.split('');
              const wordArrayWithBold = wordArray.map((wordLetter, letterIndex) => {
                return letterIndex < wordLengthHalf
                  ? `<strong>${wordLetter}</strong>`
                  : wordLetter;
              });
              return wordArrayWithBold.join('');
            });
            textElement.innerHTML = textarrayBold.join(' ');
            responseContainer.appendChild(textElement);
            textElement.style.display = 'block';
            responseContainer.style.opacity = '1';
        } else if (!typeWriter.checked && !bionic.checked){
            if(Highlighter.checked){
              const words = item.payload.message.split(/\b(?![\s.!?-])/);
              const textElement = document.createElement('p');

              for (let word of words) {
                 const wordElement = document.createElement('span');
                 wordElement.textContent = word;
                 wordElement.addEventListener('mouseover', () => {
                  wordElement.classList.add('highlighted');
                });
                wordElement.addEventListener('mouseout', () => {
                   wordElement.classList.remove('highlighted');
                 });
                textElement.appendChild(wordElement);
             }

              responseContainer.appendChild(textElement);
              textElement.style.display = 'block';
              responseContainer.style.opacity = '1';
            } else{
                 const textElement = document.createElement('p');
                textElement.textContent = item.payload.message;
                responseContainer.appendChild(textElement);
                textElement.style.display = 'block';
                responseContainer.style.opacity = '1';

            }
          }    
        
      } else if (item.type === 'path'){
        const element = document.createElement('span');
        responseContainer.appendChild(element);
      } else if (item.type == 'choice'){
          buttonarray = [item.payload.buttons]
          for(let i of buttonarray){
            for(let j of i){
              const element = document.createElement('button');
              setTimeout(2000)
              buttons.style.opacity = '1';
              buttons.appendChild(element);
              element.innerText = j.name;
              console.log('button: ', j.name)
              element.onclick = () => {
                buttons.style.opacity = '0';
                const uniqueId = generateUniqueId();
                userInput = element.innerText;
                interact(userInput, uniqueId);
                console.log('clicked');
                console.log('input', userInput);
              }
              j++
            
            }
          
          } 
        }
               
      }
    }
  }
    responseContainer.appendChild(document.createElement('p'));
    displayNextCharacter();
      }



document.addEventListener('DOMContentLoaded', () => {
  // Generate a unique ID for the user
  const uniqueId = generateUniqueId();
  // Send user input to Voiceflow Dialog API
  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const userInput = input.value.trim();
      if (userInput) {
        interact(userInput, uniqueId);
      }
    }
  });
   

  // Set the runtime, version and API key for the Voiceflow Dialog API
  inputFieldContainer.addEventListener('click', () => {
    input.focus()
  });




  // Hide placeholder on input focus
  input.addEventListener('click', () => {
    while (input.firstChild) {
    input.removeChild(input.firstChild);
  }
});

  // Restore placeholder on input blur
  input.addEventListener('blur', () => {
    input.style.caretColor = 'white'
  })

  setTimeout(() => {
    inputFieldContainer.style.animation = 'fadeIn 4s forwards'
  }, 2500)

});

// Function to generate a unique ID for the user
function generateUniqueId() {
  // generate a random string of 6 characters
  const randomStr = Math.random().toString(36).substring(2, 8)
  // get the current date and time as a string
  const dateTimeStr = new Date().toISOString()
  // remove the separators and milliseconds from the date and time string
  const dateTimeStrWithoutSeparators = dateTimeStr
    .replace(/[-:]/g, '')
    .replace(/\.\d+/g, '')
  // concatenate the random string and date and time string
  const uniqueId = randomStr + dateTimeStrWithoutSeparators
  return uniqueId
}
const sleep = m => new Promise(r => setTimeout(r, m));

function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  //document.getElementById("menuwrapper").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  //document.getElementById("menuwrapper").style.marginLeft= "0";
}

let speed_clicked = false;
function openSpeed(){
  if (speed_clicked === false){
    document.getElementById("mySpeedmenu").style.width= "75px";
    speed_clicked = true;
  } else{
    document.getElementById("mySpeedmenu").style.width= "0";
    speed_clicked = false;
  }
}


lineSpacing.addEventListener('change', linespacing)

charSpacing.addEventListener('change', charspacing)

voiceResponse.addEventListener('change', voiceresponse)

adhdFeatures.addEventListener('change', enableADHD)

dyslexiaFeatures.addEventListener('change', enableDyslexia)

autismFeatures.addEventListener('change', enableAutism)

bulletPoints.addEventListener('change', bulletpoints)



Highlighter.addEventListener("change", () => {
  typeWriter.toggleAttribute("disabled");
  bionic.toggleAttribute("disabled");
});

Font.addEventListener('change', changeFont)


