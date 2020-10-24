# 🏛️ State Department Tone Analysis

This application connects to IBM Watson for tone analysis of the Secretary of State's media appearances. The output file, result.json, is the information from each interview: tags, text, pompeoText (only when Pompeo is speaking), interviewerText (when the interviewer is speaking) and then analysis from IBM.

The output from that function is a large object with two main subdivisions: document and sentence tones. The document tones consider all of Pompeo's lines in their entirety.

## Installation

`npm install`

_or_

`yarn install`

## Environment and Development

Create an environment file and store it in the root of this folder. This file must contain the environment variables from your IBM Watson account. The variables:

```
API_KEY=[string]
URL=https://api.us-east.tone-analyzer.watson.cloud.ibm.com/instances/unique-string-here
```

Once the environment variables are created, run:

`yarn dev:start`
