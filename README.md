# CrossTalk

## Summary

CrossTalk is the app that connects users looking to learn a new language in an interactive and social way! The hardest part about learning a new language is finding someone to talk to. Simply signup and tell us what language you're interested in learning, then we'll handle the rest. CrossTalk will match you up with another user who speaks that language, and is also interested in learning __your__ native language.

## Meet Team Themisto

  - __Product Owner__: [Anton Bowden](https://github.com/AntonBowden)
  - __Scrum Master__: [Sam Olukotun](https://github.com/otsam88)
  - __Development Team Members__: [Tyler Corkill](https://github.com/TylerCorkill), [Mark Schleske](https://github.com/mschlesk)

## Table of Contents

1. [Requirements](#requirements)
1. [Technologies Used](#technologies-used)
1. [API Usage](#api-usage)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
1. [Contributing](#contributing)
    1. [Roadmap](#roadmap)

## Requirements

- Node 7.x


## Technologies Used

* Server Side
  * Express - server framework
  * Socket.IO - signaling server
* Client Side
  * Google Chrome Speech-To-Text - speech-to-text
  * Socket.IO - server communication
  * Vue - frontend framework
  * WebRTC - media stream and user connection management
* External APIs
  * Microsoft Cognitive Services - language translation

## API Usage


### Login & Signup
* ### `POST /api/signup`

 Add and authenticate a new user. Pass the user's name and password in the body of the request:
```JSON
{
  "username": "Robin Kim",
  "password": "secretsecretsecret"
}
```
 Will return a valid JSON web token (JWT) string for use in other requests. Token payload contains the user's ID and username (under the `sub` and `user` keys, respectively). See [JWT.io](https://jwt.io/) for more information.

 To make requests to protected endpoints using a token, prepend the word "Bearer" to the token string and pass under the `x-access-token` header.

 e.g. `x-access-token:Bearer your.token.string`

 **Note: tokens will expire after 7 days.**


## Development

### Installing Dependencies

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Roadmap

View the project roadmap [here](https://github.com/Themisto/CrossTalk/issues)
