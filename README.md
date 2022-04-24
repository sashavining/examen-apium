# Examen Apium (examenapium.com)
During my time as a Latin teacher, I taught 6th grade Latin in my colleague's classroom. He always had the NYTimes Spelling Bee board up on a side whiteboard. Students would write guesses throughout the day (and sometimes I would, too!).

I started thinking 'what if this were available in Latin?'. It became an early programming goal of mine to create a digital version of this puzzle playable in Latin, both for my own students and for other teachers to enjoy.

<img width="1369" alt="Apis verborum screenshot" src="https://user-images.githubusercontent.com/96848086/164977726-49768e84-bee8-4408-a190-71d3d013fa01.png">

Examen Apium was born in April 2022! I launched it to my personal Facebook in a beta run, where it gained over 150 users in its first week. I have been making adjustments to it ever since, guided by the feedback of my dedicated, core userbase of Latin teachers. I hope to launch it to a wider audience very soon.

# Getting Started
<img width="523" alt="Examen Apium Icons" src="https://user-images.githubusercontent.com/96848086/164978424-70673793-24ec-40de-87f5-61b95587747f.png">

Everything you will need to play is on the site itself. Use the icons above (backspace, clear, shuffle letters, high scores, rules, contact) to navigate the game.

![Examen Apium Being Played](https://user-images.githubusercontent.com/96848086/164978948-fcbdb596-0884-48b1-84ad-44b88717b895.gif)

# Tech Used
HTML, CSS, Vanilla JS, Perseids web API

# What did I learn?
This was my first major project using APIs, so I learned a lot about promises and async/await. I also refactored the code a couple of times, trying to make it follow the principles of OOP more and more each time. I read quite a bit about OOP in my research for this project. This was also the first project that I sought developer feedback for (see pull requests), and I wish I had asked for feedback earlier! It is so helpful to get another pair of eyes on your work.

# Future Features
The most significant feature I am hoping to add is a 'total possible points' meter, with benchmarks for the player to reach at 25%, 50%, and 75%. This will give players more feedback as to how they are doing relative to the difficulty of the board they were generated. The original puzzle also has this feature, so users familiar with the original puzzle requested it. I cannot accomplish this with the currently available Latin APIs without sending an unreasonable number of API calls, so I am hoping to eventually host my own Latin dictionary backend for this app.

Along similar lines, there are some issues with the API I am using accepting English words that it should not accept, and rejecting Latin words that it should not reject. Having my own backend for this project will solve this issue as well.

In the more immediate future, I would also love to accept keyboard inputs on desktop. 
