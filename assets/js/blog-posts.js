window.BLOG_POSTS = {
  "roslyn": {
    title: "Using Roslyn Source Generators to create a Networking Library",
    date: "May 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-14.png",
    description: "Roslyn source generators for a networking library.",
    content: `
    <h2>Introduction</h2>
    <p>So a <a href="https://bennilsson.github.io/" target="_blank">friend</a> and I have been working on a networking library and I thought I would share some information on how I used Roslyn to generate code for it. </p>
    <p>Here is a quick video of the project</p>
    <div class="video-wrapper">
        <iframe src="https://www.youtube-nocookie.com/embed/aeSxeWELe9s" title="Pinecone Networking Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    
    
    <p><a href="https://github.com/dotnet/roslyn">Roslyn</a> is a powerful compiler that allows you to create source generators (You can also create analyzers that will look at your code instead of generating new code) that will create code at compile time. This is amazing to allow people to put attributes on code and make the source generator do the heavy lifting.</p>
    <p>In this blog post I will be going over how I used source generators to basically generate the gunk that you wouldnt want programmers to deal with.</p>
    
    <h2>What is a source generator?</h2>
    <p>A source generator is a way to generate code at compile time. This means that you can create code that will be generated when you build your project. This is great for creating boilerplate code that you dont want to write yourself.</p>
    <p>For example, in the context of a Networking Library most of them will allow you to put attributes on top of methods and properties to have them "sync" like this</p>
    <pre><code class="language-csharp line-numbers">[NetworkSync]
public int Kills { get; set; }</code></pre>

    <p>This will then generate the code that will allow you to sync the kills property over the network, however how does it know what to do? </p>
    <p>Well this is where the source generator comes in, it will look at the code and generate the code that will allow you to sync the kills property over the network.</p>
    <pre><code class="language-csharp line-numbers">public partial class Player
{
    /// <remarks>This is a generated function for SyncVars</remarks>
    public override void SetupSyncVars()
    {
        PropertyChanged += (object sender, PropertyChangedEventArgs propertyChangedEventArgs) => 
        {
            Pinecone.MessageSendHelper.SendNetworkSyncVar(
                (MessageReliability)0,  
                this, 
                (true), 
                propertyChangedEventArgs.PropertyName
            );
        };
    }
    
    public System.Int32 KillsGenerated
    {
        get { return Kills; }
        set { Kills = value; NotifyPropertyChanged(); }
    }
}</code></pre>

    <p>This is the generated code that will allow you to sync the kills property over the network. This is done by creating a new property called KillsGenerated that the developer will have to set instead of the main variable</p>
    <p>It will then call the NotifyPropertyChanged function that will then call the SetupSyncVars function that will then send the message over the network and even remember the value for next time so that if it changes to the same value then it will not be sent again!</p>
    
    <h2>How does Roslyn work?</h2>
    <p>Roslyn works by giving you a basic api to read over the tokens that make up a C# file. This is how the compiler understands the file and you can even modify this before it gets sent to be compiled. </p>
    <p>It will then give you a syntax tree that you can then walk over and look for the attributes that you want to generate code for. This is done by using the <b>ISyntaxReceiver</b> interface that will allow you to look at the nodes in the tree and see if they have the attribute that you are looking for.</p>
    <pre><code class="language-csharp line-numbers"> public class SyntaxReceiver : ISyntaxReceiver
{
    public List<FieldDeclarationSyntax> Fields = new List<FieldDeclarationSyntax>();
    public List<MethodDeclarationSyntax> Methods = new List<MethodDeclarationSyntax>();
    public List<ClassDeclarationSyntax> Classes = new List<ClassDeclarationSyntax>();

    public void OnVisitSyntaxNode(SyntaxNode syntaxNode)
    {
        switch (syntaxNode)
        {
            case MethodDeclarationSyntax methodDeclarationSyntax when methodDeclarationSyntax.AttributeLists.Count > 0:
                Methods.Add(methodDeclarationSyntax);
                break;
            case FieldDeclarationSyntax fieldDeclarationSyntax when fieldDeclarationSyntax.AttributeLists.Count > 0:
                Fields.Add(fieldDeclarationSyntax);
                break;
            case ClassDeclarationSyntax classDeclarationSyntax when classDeclarationSyntax.AttributeLists.Count > 0:
                Classes.Add(classDeclarationSyntax);
                break;
        }
    }
}</code></pre>

    <p>Here is an example of a syntax tree that you can get from Roslyn, this is a very simple one however it will show you how to get the nodes that you want. </p>
    <a href="https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis" target="_blank">
        <img src="https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/media/walkthrough-csharp-syntax-figure1.png" class="img-responsive" alt="Example Roslyn syntax tree diagram">
    </a>

    <p>Because we only care about the fields and methods that have the attribute we can just check if the node has any attributes and then add it to the list.</p>

    <p>Now that we have all the nodes that we care about we can then generate the code that we want to generate. This is done by using the <b>ISourceGenerator</b> interface that will allow you generate code</p>
    <p>We can also generate static code by just injecting it into a "new" file by doing this</p>
    <pre><code class="language-csharp line-numbers">context.AddSource("GeneratedNetworkHelpers.g.cs", SourceText.From(target.ToString(), Encoding.UTF8));</code></pre>
    <p>This will then generate a new file called GeneratedNetworkHelpers.g.cs; we do this in this case so that we can inject some helper function like IsClient/IsServer and all attribute information just incase we want to update it on the fly!</p>

    <p>Now we have all the information we need to use .nets reflection system to get the attributes and then generate the code that we want to generate. </p>
    <pre><code class="language-csharp line-numbers">ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkRPC");
ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkCommand");
ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkTargetRPC");

ProcessNetworkMessageField(context, compilation, receiver, "NetworkSync");
ProcessNetworkSerialize(context, compilation, receiver, "NetworkSerialize");

ProcessStateMessage(context, compilation, receiver, "NetworkServerPlayerConnected");
ProcessStateMessage(context, compilation, receiver, "NetworkServerPlayerDisconnected");</code></pre>

<h2>Conclusion</h2>
<p>In conclusion, using Roslyn to generate code is a powerful way to create boilerplate code that you dont want to write yourself. It allows you to create code that is easy to read and understand while also being easy to maintain and became very useful if I ever needed to update the code and didnt want to break all games around it!</p>
<p>It is a bit of a pain to set up however once you have it set up it is very easy to use.</p>

<h2>Example files</h2>
<p>Here is an example of the generated code that will be generated for the NetworkRPC attribute</p>

<p>Game code:</p>
<pre><code class="language-csharp line-numbers">[NetworkRPC(MessageReliability.Unreliable, true)]
public void RpcSyncAnimToClient(AnimationInfo animationInfo)
{
}</code></pre>

<p>Generated code:</p>
<pre><code class="language-csharp line-numbers">public partial class NetworkAnimatorBasic
{
    public partial class Generated 
    {
        // <remarks>This is a generated function for NetworkRPCs</remarks>
        public static void RpcSyncAnimToClient(NetworkBehaviour networkBehaviour , Pinecone.AnimationInfo animationInfo)
        {
            if (!NetworkServer.IsActive)
            {
                Debug.LogError("Client called Server message RpcSyncAnimToClient");
                throw new ClientAccessViolationException("Client called Server message RpcSyncAnimToClient");
            }

            if (!NetworkServer.IsActive && !NetworkClient.IsConnected)
            {
                Debug.LogError("Tried to send to call RpcSyncAnimToClient with no Client or Server");
                throw new NoNetworkConnectionException("Tried to send to call RpcSyncAnimToClient with no Client or Server");
            }
            
            Pinecone.MessageSendHelper.SendNetworkRPC((MessageReliability)1,  networkBehaviour, (true), "RpcSyncAnimToClient" , animationInfo);
        }
    }
}
</code></pre>

<p>Here is an example of the generated code that will be generated for the NetworkMessage attribute</p>

<p>Game code:</p>
<pre><code class="language-csharp line-numbers">[NetworkSerialize]
public class PlayerInfo
{
    public Color32 color;
    public string playerName;

    public PlayerInfo()
    {

    }

    public PlayerInfo(Color32 color, string playerName)
    {
        this.color = color;
        this.playerName = playerName;
    }
}</code></pre>
<p>Generated code:</p>
<pre><code class="language-csharp line-numbers">public partial class NetworkMessage
{
    public NetworkMessage AddPlayerInfo(PlayerInfo value)
    {
        return Add(value);
    }

    public NetworkMessage Add(PlayerInfo value)
    {
        Add(value.color);
        Add(value.playerName);
        return this;
    }

    public PlayerInfo Get(PlayerInfo value)
    {
        return GetPlayerInfo();
    }

    public PlayerInfo GetPlayerInfo()
    {
        var value = new PlayerInfo();
        value.color = GetColor();
        value.playerName = GetString();
        return value;
    }
}
</code></pre>
    `
  },
  "acorn2d": {
    title: "Building Acorn2D: Tools from a Custom Multiplayer Engine",
    date: "April 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-12.png",
    description: "Building a 2D game engine from scratch in C++.",
    content: `<h2>Introduction</h2>
<p>Arcon2D is a 2D Multiplayer Engine that a <a href="https://bennilsson.github.io/" target="_blank">friend</a> and I have been working on for a while now. It is a custom engine that is built from the ground up.</p>
<p>It is a 2D engine that is built on top of <a href="https://www.glfw.org/" target="_blank">GLFW</a> and <a href="https://www.glfw.org/" target="_blank">OpenGL</a>.</p>
<p>So why did we make this engine? Well, I wanted to learn how to make a game engine. I have always been interested in game engines and how they work. So we thought we would give it a go and see what we can learn.</p>

<h2>The projects</h2>
<p>In Acorn there are three projects that are important to understand. The first is the <strong>Engine</strong> project, which contains the engine code. The second is the <strong>TestGame</strong> project, which contains the game code. The third is the <strong>Acorn</strong> project, which contains the editor.</p>

<p>The <strong>Engine</strong> project is a C++ project that contains the engine code (duh). It is a static library that is linked to the <strong>TestGame</strong> project that means that the engine code is compiled into the game executable. 
<!-- The game  -->

<h2>Tracey</h2>
<p>Tracey is a C++ profiler that was amazing to set up. It is a header only library that is very easy to use. It has a very simple API and it is very fast.</p>

<p></p>The part that got me excited is that you can use it from the website if you have a saved profiling session meaning you can test it against older versions of your code to see if you made an improvement</p>
<p><a href="https://tracy.nereid.pl/" target="_blank">Link to tracey here</a></p>

<p>I managed to use it to improve performance up to 2000fps along the way managed to pick up some awesome screnshots
<img src="assets/img/funny-0.png" class="img-responsive" alt="Tracey profiler showing extremely high frame time spikes in a humorous way"></p>

<!-- aixlog -->
<h2>Aixlog</h2>
<p>Aixlog is a C++ logging library that is very easy to use. It has a very simple API and it is very fast. </p>
<pre><code class="language-cplusplus line-numbers">Log::init(
{
	std::make_shared<SinkCout>(Severity::trace, "%H:%M.%S [#severity] [#file | Function: #function | Line: #line] #message"),
	std::make_unique<SinkFile>(Severity::trace, "latest.log", "%H:%M.%S [#severity] [#file | Function: #function | Line: #line] #message"),
	std::make_shared<SinkNative>(gameTitle, Severity::error) 
});</code></pre>

<p>This is what the example looks like </p>
<pre><code class="language-cplusplus line-numbers">22:10.36 [Info] [Game.cpp | Function: InitializeInternal | Line: 35] Logging Initialized.
22:10.36 [Info] [Game.cpp | Function: InitializeInternal | Line: 37] Engine Initializing.
22:10.36 [Info] [Renderer.cpp | Function: Initialize | Line: 33] Renderer Initialized.
22:11.42 [Warning] [SceneManager.cpp | Function: DestroyAllPendingGameObjects | Line: 296] GameObject is still referenced after being destroyed | 2 | class std::shared_ptr<class GameObject> | Ignore this unless there is loads of them.
</code></pre>

<h2>Lua</h2>
<p>So you might be going hold on a minute; why lua? and honestly it was something I just wanted to try out. I had used lua before however never implemented it into a game engine.</p>


<p>I used <a href="https://github.com/ThePhD/sol2" target="_blank">sol2</a> which is a C++ to lua api to make it easier than writing raw lua api calls to make functions.</p>

<p>This is some of the example code that I used within the base addon that I had to spawn people and pick them up</p>
<pre><code class="language-lua line-numbers">local function leftButtonUp()
	isPickingSomeoneUp = false

	for key, gameObjectData in pairs(gameObjects) do
		local gameObject = gameObjectData.obj
		local isPickedUp = gameObjectData.isPickedUp

		if (gameObject == null or not gameObject:IsValid() or not isPickedUp) then
			goto continue_end
		end
	
		local spriteComponent = gameObject:GetSpriteComponent()
		if (spriteComponent == null) then
			goto continue_end
		end
		
		spriteComponent:SetPivot(Vector2(0.5, 0.5))
		spriteComponent:SetColor(Vector4(1, 1, 1, 1))
		spriteComponent:SetTexture("Player_Idle_1")
		spriteComponent:SetSortingLayer("Test")

		gameObjectData.isPickedUp = false

		::continue_end::
	end
end

hook.Add("OnMouseButtonUp", "OnMouseButtonUp", function(isLeftButton)
	if (isLeftButton) then
		leftButtonUp()
	end
end)


hook.Add("OnSceneChanged", "OnSceneChanged", function()
	for key in pairs(gameObjects) do
		gameObjects[key] = null;
	end
end)</code></pre>
<p>This is a video of what the code does, there is more code however you get the idea. </p>
<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/yAzBE10zwpk" title="Acorn2D Lua Scripting Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Protobufs</h2>
<p>Protobufs are a way to serialize data in a way that is very fast and very small. It is a binary format that is very fast to read and write. It is also very small, which is great for network traffic.</p>
<p>It is a bit of a pain to set up however once you have it set up it is very easy to use. You just need to create a .proto file and then run the protoc compiler on it. It will generate C++ code that you can use to serialize and deserialize the data.</p>
<pre><code class="language-protobuf line-numbers">syntax = "proto3";
package engine;
import "google/protobuf/any.proto";

enum MessageType 
{
	TYPE_INVALID = 0;
	TYPE_JOIN_REQUEST = 1;
	TYPE_JOIN_REQUEST_REJECTED = 2;
	TYPE_CHANGE_SCENE = 3;
	TYPE_CONNECTION_INFO_REQUEST = 4;
	TYPE_CONNECTION_INFO = 5;
	TYPE_LOCAL_PLAYER_INFO = 6;
	TYPE_PLAYER_INFO = 7;
	TYPE_CREATE_GAMEOBJECT = 8;
	TYPE_GAME = 9;
}

message NetMessage 
{
	optional MessageType msg_type = 1;
	optional google.protobuf.Any msg_data = 2;
}

message CS_JoinRequest {} // has no data? maybe password or something or mod list
message SV_ConnectionInfoRequest {} // has no data?

message CS_ConnectionInfo
{
	optional string steamKey = 1;
}

message SV_JoinRequestRejected
{
	optional string reason = 1;
}

message SV_ChangeScene
{
	optional uint64 sceneId = 1;
}

message DisconnectedMessage 
{
	optional int32 client_id = 1; // ID of person that connected
	optional string reason = 2; // Reason for disconnection
}

message SV_LocalPlayerInfo
{
	optional int32 localPlayerId = 1;
	repeated SV_PlayerInfo players = 2;
}

message SV_PlayerInfo
{
	optional int32 playerId = 1;
}

message NetMessages 
{
	message NetMessage_t 
	{
		optional int32 tick = 1;
		optional NetMessage msg = 2;
	}

	repeated NetMessages.NetMessage_t usermsgs = 1;
}</code></pre>

<p>This is our base protobuf for the engine; this is how multiplayer works. At the moment it is very inspired by source engine and how that works so there are "ticks" and network messages</p>

<h2>Conclusion</h2>
<p>So this is the architecture of Acorn2D. It is a very simple engine that is very easy to use. It is also very fast and very small. It is a great engine for 2D games and it is very easy to use.</p>
<p>Honestly I am very happy with how it has gone and will make more blogs on it in the future as there is some awesome stuff in here!</p>`
  },
  "gmod": {
    title: "How Garry's Mod Kickstarted My Game Dev Journey",
    date: "March 2023",
    author: "Josh Mobley",
    headerImage: "assets/img/gmod_background.jpg",
    description: "My experience scripting in Garry's Mod.",
    content: `<h2>The Beginning of a Journey</h2>
<p>My programming journey began in 2013 when I discovered Garry's Mod (GMod), a sandbox modification for Valve's Source engine. What started as simple in-game experimentation quickly evolved into a passion for creating custom content and scripts that would enhance the gaming experience for myself and thousands of other players.</p>

<h2>Learning Through Creating</h2>
<p>Garry's Mod uses Lua as its scripting language, which became my first programming language. Despite having no formal programming education at the time, I taught myself through online resources, community forums, and a lot of trial and error. The immediate visual feedback loop of GMod made it an ideal learning environment—I could see my code's effects in real-time within the game world.</p>

<pre><code class="language-lua line-numbers">-- Example of a simple Garry's Mod entity spawn function
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
end)</code></pre>
						
<h3>My First Projects</h3>
<p>I began by creating simple modifications like custom weapons, tools, and entities. These early projects taught me the basics of:</p>
<ul>
    <li>Object-oriented programming concepts</li>
    <li>Game physics and collision detection</li>
    <li>User interface design</li>
    <li>Network synchronization for multiplayer experiences</li>
    <li>Optimization techniques for better performance</li>
</ul>

<h2>Growing with the Community</h2>
<p>What truly accelerated my development was the vibrant GMod community. I joined several development teams where I collaborated with other creators on larger projects. These experiences taught me essential teamwork skills:</p>
<ul>
    <li>Version control using SVN and later Git</li>
    <li>Code review practices</li>
    <li>Documentation writing</li>
    <li>Balancing feature implementation with performance considerations</li>
</ul>

<h3>Major Projects and Achievements</h3>
<p>Over the years, I worked on several significant GMod projects</p>

<h2>Technical Challenges and Solutions</h2>
<p>Working within GMod presented unique challenges that helped me develop problem-solving skills I still use today:</p>

<h3>Performance Optimization</h3>
<p>GMod servers often host 50+ players simultaneously, making performance optimization critical. I learned to profile code, reduce network traffic, and implement efficient algorithms.</p>

<h3>Networking Challenges</h3>
<p>Synchronizing game state across multiple clients required deep understanding of network architecture. I developed techniques to minimize bandwidth usage while maintaining consistent experiences for all players.</p>

<h2>Impact on My Career Path</h2>
<p>The skills I gained from GMod development directly impacted my career trajectory:</p>
<ul>
    <li>It solidified my decision to pursue a degree in Computer Games Development</li>
    <li>The portfolio of GMod projects helped me secure my first industry internship</li>
    <li>Problem-solving approaches I developed have been invaluable in professional game development</li>
    <li>Community management experience provided soft skills that complemented my technical abilities</li>
</ul>

<h2>Lasting Lessons</h2>
<p>Looking back, GMod provided me with far more than just programming knowledge:</p>
<ul>
    <li><strong>Self-directed learning:</strong> I developed the ability to research and teach myself new concepts</li>
    <li><strong>Community collaboration:</strong> Working with others toward shared creative goals</li>
    <li><strong>User-focused design:</strong> Creating content with the end user's experience as the priority</li>
    <li><strong>Iterative development:</strong> The value of continuous improvement through feedback and refinement</li>
</ul>

<h2>Conclusion</h2>
<p>Garry's Mod was far more than a game for me—it was the foundation upon which I built my programming career. The hands-on experience, community collaboration, and creative freedom it provided set me on the path to becoming a professional game developer.</p>

<p>Today, when I work on complex systems at professional studios, I still find myself drawing on lessons I learned creating Lua scripts for GMod all those years ago. It stands as a testament to how powerful game modding can be as an entry point into programming and game development.</p>`
  },
  "mario": {
    title: "Mario: A Platformer Remake in SDL",
    date: "February 2023",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-1.jpg",
    description: "Recreating Mario platformer mechanics in SDL.",
    content: `<h2>Introduction to the Mario Recreation Project</h2>
<p>For one of my university assignments, I was tasked with recreating a classic game. I chose to recreate Mario. This project allowed me to gain experience with making 2D games while developing a deeper understanding of what makes platformer mechanics feel responsive and satisfying.</p>

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/6ndRuoH8Zi4" title="Mario Remake in SDL Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Key Implementation Challenges</h2>

<h3>Character Controller</h3>
<p>Creating a character controller that felt authentic to the original Mario was one of the most significant challenges. This included:</p>
<ul>
    <li>Implementing variable jump heights based on button press duration</li>
    <li>Fine-tuning acceleration and deceleration to match the original's feel</li>
    <li>Adding coyote time (allowing jumps slightly after leaving a platform) for better playability</li>
    <li>Programming how Mario interacts with different surfaces and enemies</li>
</ul>

<h3>Level Design and Tile Systems</h3>
<p>I used tilemap system to efficiently create levels inspired by the original game. This allowed me to:</p>
<ul>
    <li>Quickly iterate on level designs</li>
    <li>Create collision rules for different tile types</li>
    <li>Implement interactive elements like question blocks and breakable bricks</li>
</ul>

<h2>Technical Highlights</h2>

<h3>Physics-Based Movement</h3>
<p>I created a custom physics system that more accurately recreated Mario's distinctive movement feel. This gave me precise control over how the character responded to player input.</p>

<h3>Responsive Controls</h3>
<p>I spent significant time fine-tuning the controls to ensure they felt responsive and intuitive. Small details like input buffering (allowing a jump input slightly before landing) made the game feel much more polished.</p>

<h3>Authentic Visual Effects</h3>
<p>I implemented various visual effects to match the original game's aesthetic:</p>
<ul>
    <li>Particle effects for coin collection, block breaking, and enemy defeats</li>
    <li>Screen shake for significant impacts</li>
    <li>Animation transitions that matched the original game's style</li>
</ul>

<h2>Key Learnings</h2>
<p>Through this project, I gained valuable insights into:</p>
<ul>
    <li>The importance of "game feel" and how subtle adjustments to movement parameters can dramatically impact player experience</li>
    <li>Efficient ways to organize game code for a platformer, with clear separation between input handling, physics calculations, and visual updates</li>
    <li>How to analyze and recreate mechanics from existing games</li>
    <li>The value of constant playtesting and iteration</li>
</ul>

<h2>Conclusion</h2>
<p>Recreating Mario provided me with a deeper appreciation for the nuanced design of classic platformers. The project pushed me to pay attention to details that players might not consciously notice but significantly impact how the game feels to play.</p>`
  },
  "mmo": {
    title: "Designing a Scalable MMO: My Final Year Project",
    date: "May 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-9.jpg",
    description: "Building a multiplayer online game for my final year project.",
    content: `<h2>Introduction</h2>
<p>This project aims to create a massively multiplayer online game (MMO) framework that would allow me to develop a game that can be played by many players simultaneously. The framework is designed to be flexible and scalable, allowing for easy integration of new features and content.</p>
<p>I explored industry standards and best practices in game development, focusing on network architecture, server-client communication, and database management. The project also includes a prototype "game" that demonstrates the capabilities of the framework.</p>

<h2>Project Overview</h2>
<p>The project is built using a combination of C# and Unity for the game client. The framework supports real-time multiplayer interactions, player authentication, and data persistence.</p>
<p>Key features of the framework include:</p>
<ul>
    <li>Player authentication and account management</li>
    <li>Data persistence using a relational database</li>
    <li>Modular architecture for easy feature integration</li>
    <li>Protobufs for efficient data serialization</li>
</ul>

<h2>Protobufs</h2>

<p>Protobufs (Protocol Buffers) are used for efficient serialization of data. They allow for compact and fast data exchange between the server and client. The framework uses Protobufs to define the structure of messages exchanged during gameplay and even between services themselves</p>
<p>There were 3 worlds created, each with their own set of services that could be turned on at will and off. The worlds were:</p>
<ul>
    <li>World 1: DungeonTemplate</li>
    <li>World 2: MainWorldTemplate</li>
    <li>World 3: TownTemplate</li>
</ul>

<h2>Worlds</h2>

<p>Worlds were like "servers" in the sense that they could be created and destroyed at will. Each world had its own set of services that could be turned on and off at will. The worlds were:</p>
<ul>
    <li>Service 1: Login Service</li>
    <li>Service 2: Game Service</li>
    <li>Service 3: Chat System</li>
</ul>

<p>Each service was its own process, meaning that they could be run on different machines or even in different data centers. This allows for scalability and flexibility in the architecture</p>
<p>MainWorldTemplate was used as a login world and so it only had use for the login service. The TownTemplate was used as a game world and so it had use for the game service and chat system. The DungeonTemplate was used as a dungeon world and so it had use for the game service and chat system.</p>

<br>
<p>Here is an example of the MainWorldTemplate class:</p>
<pre><code class="language-csharp line-numbers">public class MainWorldTemplate : WorldData
{
	public override bool IsJoinable => false;
	protected override bool IsUserIdsValid => false;

	public override void Start()
	{
		SceneId = SceneID.LoginScreen;
		WorldType = WorldType.Main;
		Services.Add(ServiceManager.LoadAndCreateService(new ServiceInfo(LoginService.Definition.Create(), WorldId, WorldType)));
		
		base.Start();
	}

	public override WorldData CreateNew()
	{
		return new MainWorldTemplate();
	}
}</code></pre>

<p>Services could speak to one and another meaning that the login service could speak to the game service and the chat system. This was done using Protobufs so that services could query each other for the state of the user</p>
<p>Here is an example of the Chat Service talking to the Game Service:</p>
<pre><code class="language-csharp line-numbers">private static void AdminFlight(ServiceSocketClient socket, string[] args, int userId)
{
	var packet = InternalMessageTemplate.CreateInstance(
		MessageID.AdminFlight,
		new Recipients(RecipientType.SpecificServiceInWorld, null, ServiceType.Game), new PacketBase());
	
	socket.Send(packet);
}</code></pre>

<p>In this example, the chat service is sending a message to the game service. This allowed the user to fly however the chat service did not know what to do with that command so it sent it over to the game service which could handle permissions and so on.</p>

<h2>Conclusion</h2>
<p>The project successfully demonstrates the capabilities of the MMO framework, showcasing its modular architecture and efficient data handling using Protobufs and allowing for services to talk to each other shows scalability while I am sure there would be bottlenecks it was great to get this working.</p>

<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/i4QLsQG_lhE" title="MMO Framework Final Year Project Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`
  },
  "towerdefence": {
    title: "Online Co-op Tower Defence: Multiplayer & Optimization",
    date: "September 2020",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-0.jpg",
    description: "Online co-op tower defence game in Unity.",
    content: `<h2>Introduction to Tower Defence Project</h2>
<p>This project marked my first university assignment in my second year of studies. I was tasked with creating a tower defence game, and I decided to elevate the challenge by implementing an online co-op feature where players could collaborate to defend against attacking military forces.</p>

<p>I chose a military theme with a simplistic art style, which aligns with the aesthetic commonly used in tower defence games and provided a clean, cohesive look.</p>

<h3>Latest Development Video</h3>
<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/YPYEVccUKag?controls=1" title="Tower Defence Development Update Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h3>Multiplayer Showcase</h3>
<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/R_sFwsqeBqQ" title="Tower Defence Multiplayer Gameplay Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Key Learnings from this Project</h2>

<h3>Networking Implementation</h3>
<p>One of the most significant challenges was implementing the networking components using Mirror, a networking library for Unity. I had to carefully structure the game architecture to manage authority over different game objects correctly.</p>

<p>The hierarchy needed to be organized in a specific way to ensure each player had authority over their objects. Here's how I structured it:</p>

<img src="https://i.imgur.com/vHbfAka.png" alt="Unity Hierarchy showing player object structure for Mirror Networking authority">

<p>This structure allowed each player's objects to have the proper authority, which was crucial for synchronized gameplay across the network.</p>

<h3>Performance Optimization</h3>
<p>With multiple players and numerous enemies and projectiles on screen, performance optimization became a priority. I implemented various techniques including:</p>
<ul>
    <li>Object pooling for frequently instantiated objects like bullets and enemies</li>
    <li>Efficient network message handling to reduce bandwidth usage</li>
</ul>

<h3>User Interface Design</h3>
<p>Designing a UI that was both informative and unobtrusive was another challenge. Players needed access to important information about their resources, tower options, and game state without cluttering the screen.</p>

<h3>Balancing Game Mechanics</h3>
<p>Creating a balanced game experience that was challenging but not frustrating required extensive testing and iteration. I had to fine-tune:</p>
<ul>
    <li>Enemy health and movement speed</li>
    <li>Tower damage, range, and cost</li>
    <li>Resource generation rates</li>
    <li>Wave progression difficulty</li>
</ul>

<h2>Technical Achievements</h2>
<p>Some of the technical elements I'm most proud of in this project include:</p>
<ul>
    <li>A functional network synchronization system that maintained consistency across clients</li>
    <li>Dynamic enemy pathing that could adapt to player-placed towers</li>
    <li>A resource management system that balanced tower building with defense needs</li>
    <li>A wave generation system that scaled with player count and game progression</li>
</ul>

<h2>Conclusion</h2>
<p>This tower defence project was an invaluable learning experience that challenged me to apply both game design principles and technical skills in a practical context. The multiplayer component added significant complexity but also made the final product much more engaging.</p>

<p>The lessons learned here—particularly regarding networking, optimization, and balance—have informed my approach to game development ever since, providing a foundation for more advanced projects.</p>`
  },
  "01": {
    title: "Object Pooling in Multiplayer: Performance & Pitfalls",
    date: "October 2020",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-11.png",
    description: "The issues with using Object Pooling in a fully multiplayer game.",
    content: `<h2>The Challenge</h2>
<p>In my university Tower Defence game project, I faced the challenge of efficiently spawning large numbers of enemies and projectiles without causing performance drops. The solution was to implement an object pooling system that would reuse game objects instead of constantly creating and destroying them.</p>

<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/-Bgl3AXwzYg?showinfo=0" title="Object Pooling Script Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<p>The video above demonstrates my object pooling script in action. It allows me to easily pool and unpool objects by an ID, significantly improving performance for frequently spawned objects like bullets and enemies.</p>

<h2>Implementation</h2>
<p>Here's an example of the code needed to retrieve an object from the pool:</p>
<pre><code class="language-csharp line-numbers">GameObject isPooled = objectPooler.curObjectPooler.getObject(ID);
GameObject curBullet = isPooled;

if (!isObjectPooled)
curBullet = Instantiate(PREFAB);</code></pre>

<h2>Data Structure</h2>
<p>The object pool is stored in a data structure that allows for multiple objects with the same ID, making it possible to have multiple "bullets" with the same identifier but as different instances:</p>
<pre><code class="language-csharp line-numbers">public List<KeyValuePair<string, GameObject>> objectPool;</code></pre>

<h2>Challenges Encountered</h2>
<p>While the solution greatly improved performance, it wasn't without issues. One significant problem was that objects weren't properly resetting to their default state when returned to the pool, resulting in enemies sometimes spawning with incorrect health values or the wrong class properties. This led to some interesting and unexpected behaviors:</p>

<div class="video-wrapper">
    <iframe src="https://www.youtube.com/embed/kwmzc38T6Ek?showinfo=0" title="Object Pooling Bug Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Benefits</h2>
<p>Despite these challenges, the object pooling system significantly improved performance, allowing me to spawn large numbers of enemies and projectiles with minimal impact on frame rate. This was a crucial optimization for maintaining smooth gameplay, especially in multiplayer scenarios where networking adds additional overhead.</p>

<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/POXiNS1v1dQ?showinfo=0" title="Object Pooling Performance Benefit Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

<h2>Key Lessons</h2>
<p>Through implementing this system, I learned valuable lessons about:</p>
<ul>
    <li>Memory management in game development</li>
    <li>The importance of proper object state management</li>
    <li>Performance optimization for real-time multiplayer games</li>
    <li>Debugging complex object behavior in networked environments</li>
</ul>`
  }
};
