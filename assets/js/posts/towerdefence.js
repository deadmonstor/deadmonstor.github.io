window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["towerdefence"] = {
  title: "Online Co-op Tower Defence: Multiplayer & Optimization",
  date: "September 2020",
  author: "Josh Mobley",
  headerImage: "assets/img/portfolio/portfolio-0.jpg",
  description: "Online co-op tower defence game in Unity.",
  content: `## Introduction to Tower Defence Project
This project marked my first university assignment in my second year of studies. I was tasked with creating a tower defence game, and I decided to elevate the challenge by implementing an online co-op feature where players could collaborate to defend against attacking military forces.

I chose a military theme with a simplistic art style, which aligns with the aesthetic commonly used in tower defence games and provided a clean, cohesive look.

### Latest Development Video
<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/YPYEVccUKag?controls=1" title="Tower Defence Development Update Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Multiplayer Showcase
<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/R_sFwsqeBqQ" title="Tower Defence Multiplayer Gameplay Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Key Learnings from this Project

### Networking Implementation
One of the most significant challenges was implementing the networking components using Mirror, a networking library for Unity. I had to carefully structure the game architecture to manage authority over different game objects correctly.

The hierarchy needed to be organized in a specific way to ensure each player had authority over their objects. Here's how I structured it:

<img src="https://i.imgur.com/vHbfAka.png" alt="Unity Hierarchy showing player object structure for Mirror Networking authority">

This structure allowed each player's objects to have the proper authority, which was crucial for synchronized gameplay across the network.

### Performance Optimization
With multiple players and numerous enemies and projectiles on screen, performance optimization became a priority. I implemented various techniques including:

*   Object pooling for frequently instantiated objects like bullets and enemies
*   Efficient network message handling to reduce bandwidth usage

### User Interface Design
Designing a UI that was both informative and unobtrusive was another challenge. Players needed access to important information about their resources, tower options, and game state without cluttering the screen.

### Balancing Game Mechanics
Creating a balanced game experience that was challenging but not frustrating required extensive testing and iteration. I had to fine-tune:

*   Enemy health and movement speed
*   Tower damage, range, and cost
*   Resource generation rates
*   Wave progression difficulty

## Technical Achievements
Some of the technical elements I'm most proud of in this project include:

*   A functional network synchronization system that maintained consistency across clients
*   Dynamic enemy pathing that could adapt to player-placed towers
*   A resource management system that balanced tower building with defense needs
*   A wave generation system that scaled with player count and game progression

## Conclusion
This tower defence project was an invaluable learning experience that challenged me to apply both game design principles and technical skills in a practical context. The multiplayer component added significant complexity but also made the final product much more engaging.

The lessons learned here—particularly regarding networking, optimization, and balance—have informed my approach to game development ever since, providing a foundation for more advanced projects.`
};

