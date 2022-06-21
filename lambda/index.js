/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

var name=null;
var date=null;
var time=null;
var normaldaytimings = "9 AM to 5 PM";
var satdaytiming="9 AM to 1 PM";
var oraloptions="hair-cut, waxing, hair-dyeing, shaving, facial, manicure, pedicure";
var writtenoptions= "1) Hair-Cut 150\n2) Waxing 300\n3) Hair-Dyeing 500\n4) Shave 100\n5) Facial 400\n6) Manicure 300\n7) Pedicure 350 ";
const cost=[150,300,500,100,400,300,350];
var sum=0;
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Beauty and Grace Salon. I am your virtual assistant in helping you book your appointment. To start with, what shall I call you?';
        const repromptOutput='What shall I call you?';
        
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};

const CustomerAuthenticationIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "CustomerAuthenticationIntent"
    );
  },
  handle(handlerInput) {
    const slotNames = handlerInput.requestEnvelope.request.intent.slots;
    name = slotNames.name.value;
  // phone = slotNames.Phone.value;
    const speakOutput = `Welcome ${name}`;
  // const cardTitle = "Menu";
  //  const cardContent = writtenMenuFood;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .addDelegateDirective({
                name: 'DateIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
      .getResponse();
  }
};

const DateIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DateIntent';
    },
    handle(handlerInput)
    {
      // var speakOutput=null;
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        date = Alexa.getSlotValue(requestEnvelope,'Date');
        var speakOutput=null;
        var new_date=date.split('-');
        const table = new Map([
  ["01", "January"],
  ["02", "February"],
  ["03", "March"],
  ["04","April"],
  ["05","May"],
  ["06","June"],
  ["07","July"],
  ["08","August"],
  ["09","September"],
  ["10","October"],
  ["11","November"],
  ["12","December"]
]);
        const dateform=new Date(table.get(new_date[1])+" "+new_date[2]+", "+new_date[0]+" 01:15:00");
        
         if(dateform.getDay()===0){
          speakOutput='Sorry, we are closed on Sundays. Please suggest another date';
          return handlerInput.responseBuilder
              .speak(speakOutput)
           
          .getResponse();
          }
         else if(dateform.getDay()===6) {
             speakOutput=`Alright, the timings are from ${satdaytiming}. What time slot would you prefer?`;
         }
         else{
            speakOutput=`Alright, the reservation is on ${date},  the timings are from ${normaldaytimings}.`;
         }
        
      return handlerInput.responseBuilder
          .speak(speakOutput)
          .addDelegateDirective({
                name: 'TimeIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
          .getResponse();
    }
};

const TimeIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'TimeIntent';
  },
  handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        time = Alexa.getSlotValue(requestEnvelope,'Time');

        const speakOutput = `Your appointment has been reserved at ${time}. We offer various services like ${oraloptions}.`;
        const cardTitle = "Catalogue";
        const cardContent = writtenoptions;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(cardTitle, cardContent)
             .addDelegateDirective({
                name: 'ServiceIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt(speechText)
            .getResponse();
  },
};

const ServiceIntentHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ServiceIntent';
  },
  handle(handlerInput) {
        // const slotNames = handlerInput.requestEnvelope.request.intent.slots;
        // var service = slotNames.Service.slotValue.values;
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        const service = Alexa.getSlotValue(requestEnvelope,'Service');
        
        const test=service.split(' ') // [ 'free', 'code', 'camp' ];
        
      const table = new Map([
  ["waxing", 300],
  ["manicure", 300],
  ["pedicure", 350],
  ["facial",400],
  ["hair-dyeing",500],
  ["hair-cut",150],
  ["shave",100]
]);

       // console.log(test[0]);

         test.forEach((item)=>{
         sum+=table.get(item);
     });
        const speakOutput = `Alright. Your appointment is reserved on `+ date+ ' at '+ time +' and you would avail '+ service +' services. The total cost is amounting to Rs '+sum+". Is that about it?";
        const speakOutput1='Thank you for booking at Beauty and Grace';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput1)
            .addDelegateDirective({
                name: 'CancelAndStopIntent',
                confirmationStatus: 'NONE',
                slots: {}
            })
            //.reprompt(speechText)
            .getResponse();
  },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = `Hey. I am here to help you book an appointment. You can start by telling your name`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Thank you for booking at Beauty and Grace';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CustomerAuthenticationIntentHandler,
        DateIntentHandler,
        TimeIntentHandler,
        ServiceIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();