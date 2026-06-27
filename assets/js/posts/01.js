window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["01"] = {
  title: "Object Pooling in Multiplayer: Performance & Pitfalls",
  date: "October 2020",
  author: "Josh Mobley",
  headerImage: "assets/img/portfolio/portfolio-11.png",
  description: "The issues with using Object Pooling in a fully multiplayer game.",
  content: `## The Challenge
In my university Tower Defence game project, I faced the challenge of efficiently spawning large numbers of enemies and projectiles without causing performance drops. The solution was to implement an object pooling system that would reuse game objects instead of constantly creating and destroying them.

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/-Bgl3AXwzYg?showinfo=0" title="Object Pooling Script Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

The video above demonstrates my object pooling script in action. It allows me to easily pool and unpool objects by an ID, significantly improving performance for frequently spawned objects like bullets and enemies.

## Implementation
Here's an example of the code needed to retrieve an object from the pool:
\`\`\`csharp
GameObject isPooled = objectPooler.curObjectPooler.getObject(ID);
GameObject curBullet = isPooled;

if (!isObjectPooled)
curBullet = Instantiate(PREFAB);
\`\`\`

## Data Structure
The object pool is stored in a data structure that allows for multiple objects with the same ID, making it possible to have multiple "bullets" with the same identifier but as different instances:
\`\`\`csharp
public List<KeyValuePair<string, GameObject>> objectPool;
\`\`\`

## Challenges Encountered
While the solution greatly improved performance, it wasn't without issues. One significant problem was that objects weren't properly resetting to their default state when returned to the pool, resulting in enemies sometimes spawning with incorrect health values or the wrong class properties. This led to some interesting and unexpected behaviors:

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/kwmzc38T6Ek?showinfo=0" title="Object Pooling Bug Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Benefits
Despite these challenges, the object pooling system significantly improved performance, allowing me to spawn large numbers of enemies and projectiles with minimal impact on frame rate. This was a crucial optimization for maintaining smooth gameplay, especially in multiplayer scenarios where networking adds additional overhead.

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/POXiNS1v1dQ?showinfo=0" title="Object Pooling Performance Benefit Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Key Lessons
Through implementing this system, I learned valuable lessons about:

*   Memory management in game development
*   The importance of proper object state management
*   Performance optimization for real-time multiplayer games
*   Debugging complex object behavior in networked environments
</ul>`
};

