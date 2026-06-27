window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["mario"] = {
  title: "Mario: A Platformer Remake in SDL",
  date: "February 2023",
  author: "Josh Mobley",
  headerImage: "assets/img/portfolio/portfolio-1.jpg",
  description: "Recreating Mario platformer mechanics in SDL.",
  content: `
## Introduction to the Mario Recreation Project
For one of my university assignments, I was tasked with recreating a classic game. I chose to recreate Mario. This project allowed me to gain experience with making 2D games while developing a deeper understanding of what makes platformer mechanics feel responsive and satisfying.

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/6ndRuoH8Zi4" title="Mario Remake in SDL Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Key Implementation Challenges

### Character Controller
Creating a character controller that felt authentic to the original Mario was one of the most significant challenges. This included:

*   Implementing variable jump heights based on button press duration
*   Fine-tuning acceleration and deceleration to match the original's feel
*   Adding coyote time (allowing jumps slightly after leaving a platform) for better playability
*   Programming how Mario interacts with different surfaces and enemies

### Level Design and Tile Systems
I used tilemap system to efficiently create levels inspired by the original game. This allowed me to:

*   Quickly iterate on level designs
*   Create collision rules for different tile types
*   Implement interactive elements like question blocks and breakable bricks

## Technical Highlights

### Physics-Based Movement
I created a custom physics system that more accurately recreated Mario's distinctive movement feel. This gave me precise control over how the character responded to player input.

### Responsive Controls
I spent significant time fine-tuning the controls to ensure they felt responsive and intuitive. Small details like input buffering (allowing a jump input slightly before landing) made the game feel much more polished.

### Authentic Visual Effects
I implemented various visual effects to match the original game's aesthetic:

*   Particle effects for coin collection, block breaking, and enemy defeats
*   Screen shake for significant impacts
*   Animation transitions that matched the original game's style

## Key Learnings
Through this project, I gained valuable insights into:

*   The importance of "game feel" and how subtle adjustments to movement parameters can dramatically impact player experience
*   Efficient ways to organize game code for a platformer, with clear separation between input handling, physics calculations, and visual updates
*   How to analyze and recreate mechanics from existing games
*   The value of constant playtesting and iteration

## Conclusion
Recreating Mario provided me with a deeper appreciation for the nuanced design of classic platformers. The project pushed me to pay attention to details that players might not consciously notice but significantly impact how the game feels to play.`
};

