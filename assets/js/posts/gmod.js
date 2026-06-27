window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["gmod"] = {
  title: "How Garry's Mod Kickstarted My Game Dev Journey",
  date: "March 2023",
  author: "Josh Mobley",
  headerImage: "assets/img/gmod_background.jpg",
  description: "My experience scripting in Garry's Mod.",
  content: `
## The Beginning of a Journey
My programming journey began in 2013 when I discovered Garry's Mod (GMod), a sandbox modification for Valve's Source engine. What started as simple in-game experimentation quickly evolved into a passion for creating custom content and scripts that would enhance the gaming experience for myself and thousands of other players.

## Learning Through Creating
Garry's Mod uses Lua as its scripting language, which became my first programming language. Despite having no formal programming education at the time, I taught myself through online resources, community forums, and a lot of trial and error. The immediate visual feedback loop of GMod made it an ideal learning environment—I could see my code's effects in real-time within the game world.

\`\`\`lua
-- Example of a simple Garry's Mod entity spawn function
function SpawnProp(ply, model)
	if (!ply:IsAdmin()) then return end
	
	local prop = ents.Create("prop_physics")
	prop:SetModel(model)
	prop:SetPos(ply:GetEyeTrace().HitPos)
	prop:Spawn()
	
	return prop
end
concommand.Add("spawn_prop", function(ply, cmd, args)
	SpawnProp(ply, args[1] or "models/props_c17/oildrum001.mdl")
end)
\`\`\`

### My First Projects
I began by creating simple modifications like custom weapons, tools, and entities. These early projects taught me the basics of:

*   Object-oriented programming concepts
*   Game physics and collision detection
*   User interface design
*   Network synchronization for multiplayer experiences
*   Optimization techniques for better performance

## Growing with the Community
What truly accelerated my development was the vibrant GMod community. I joined several development teams where I collaborated with other creators on larger projects. These experiences taught me essential teamwork skills:

*   Version control using SVN and later Git
*   Code review practices
*   Documentation writing
*   Balancing feature implementation with performance considerations

### Major Projects and Achievements
Over the years, I worked on several significant GMod projects

## Technical Challenges and Solutions
Working within GMod presented unique challenges that helped me develop problem-solving skills I still use today:

### Performance Optimization
GMod servers often host 50+ players simultaneously, making performance optimization critical. I learned to profile code, reduce network traffic, and implement efficient algorithms.

### Networking Challenges
Synchronizing game state across multiple clients required deep understanding of network architecture. I developed techniques to minimize bandwidth usage while maintaining consistent experiences for all players.

## Impact on My Career Path
The skills I gained from GMod development directly impacted my career trajectory:

*   It solidified my decision to pursue a degree in Computer Games Development
*   The portfolio of GMod projects helped me secure my first industry internship
*   Problem-solving approaches I developed have been invaluable in professional game development
*   Community management experience provided soft skills that complemented my technical abilities

## Lasting Lessons
Looking back, GMod provided me with far more than just programming knowledge:

*   **Self-directed learning:** I developed the ability to research and teach myself new concepts
*   **Community collaboration:** Working with others toward shared creative goals
*   **User-focused design:** Creating content with the end user's experience as the priority
*   **Iterative development:** The value of continuous improvement through feedback and refinement

## Conclusion
Garry's Mod was far more than a game for me—it was the foundation upon which I built my programming career. The hands-on experience, community collaboration, and creative freedom it provided set me on the path to becoming a professional game developer.

Today, when I work on complex systems at professional studios, I still find myself drawing on lessons I learned creating Lua scripts for GMod all those years ago. It stands as a testament to how powerful game modding can be as an entry point into programming and game development.`
};

