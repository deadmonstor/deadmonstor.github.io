window.BLOG_POSTS = {
  "roslyn": {
    title: "Using Roslyn Source Generators to create a Networking Library",
    date: "May 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-14.png",
    description: "Roslyn source generators for a networking library.",
    content: `
## Introduction

So a [friend](https://bennilsson.github.io/) and I have been working on a networking library and I thought I would share some information on how I used Roslyn to generate code for it.

Here is a quick video of the project
<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/aeSxeWELe9s" title="Pinecone Networking Demo Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


[Roslyn](https://github.com/dotnet/roslyn) is a powerful compiler that allows you to create source generators (You can also create analyzers that will look at your code instead of generating new code) that will create code at compile time. This is amazing to allow people to put attributes on code and make the source generator do the heavy lifting.

In this blog post I will be going over how I used source generators to basically generate the gunk that you wouldnt want programmers to deal with.

## What is a source generator?

A source generator is a way to generate code at compile time. This means that you can create code that will be generated when you build your project. This is great for creating boilerplate code that you dont want to write yourself.

For example, in the context of a Networking Library most of them will allow you to put attributes on top of methods and properties to have them "sync" like this

\`\`\`csharp
[NetworkSync]
public int Kills { get; set; }
\`\`\`

This will then generate the code that will allow you to sync the kills property over the network, however how does it know what to do?

Well this is where the source generator comes in, it will look at the code and generate the code that will allow you to sync the kills property over the network.

\`\`\`csharp
public partial class Player
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
}
\`\`\`

This is the generated code that will allow you to sync the kills property over the network. This is done by creating a new property called KillsGenerated that the developer will have to set instead of the main variable

It will then call the NotifyPropertyChanged function that will then call the SetupSyncVars function that will then send the message over the network and even remember the value for next time so that if it changes to the same value then it will not be sent again!

## How does Roslyn work?

Roslyn works by giving you a basic api to read over the tokens that make up a C# file. This is how the compiler understands the file and you can even modify this before it gets sent to be compiled.

It will then give you a syntax tree that you can then walk over and look for the attributes that you want to generate code for. This is done by using the **ISyntaxReceiver** interface that will allow you to look at the nodes in the tree and see if they have the attribute that you are looking for.

\`\`\`csharp
 public class SyntaxReceiver : ISyntaxReceiver
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
}
\`\`\`

Here is an example of a syntax tree that you can get from Roslyn, this is a very simple one however it will show you how to get the nodes that you want.
<a href="https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/syntax-analysis" target="_blank">
    <img src="https://learn.microsoft.com/en-us/dotnet/csharp/roslyn-sdk/get-started/media/walkthrough-csharp-syntax-figure1.png" class="img-responsive" alt="Example Roslyn syntax tree diagram">
</a>

Because we only care about the fields and methods that have the attribute we can just check if the node has any attributes and then add it to the list.

Now that we have all the nodes that we care about we can then generate the code that we want to generate. This is done by using the **ISourceGenerator** interface that will allow you generate code

We can also generate static code by just injecting it into a "new" file by doing this

\`\`\`csharp
context.AddSource("GeneratedNetworkHelpers.g.cs", SourceText.From(target.ToString(), Encoding.UTF8));
\`\`\`
This will then generate a new file called GeneratedNetworkHelpers.g.cs; we do this in this case so that we can inject some helper function like IsClient/IsServer and all attribute information just incase we want to update it on the fly!

Now we have all the information we need to use .nets reflection system to get the attributes and then generate the code that we want to generate.
\`\`\`csharp
ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkRPC");
ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkCommand");
ProcessNetworkMessageMethod(context, compilation, receiver, "NetworkTargetRPC");

ProcessNetworkMessageField(context, compilation, receiver, "NetworkSync");
ProcessNetworkSerialize(context, compilation, receiver, "NetworkSerialize");

ProcessStateMessage(context, compilation, receiver, "NetworkServerPlayerConnected");
ProcessStateMessage(context, compilation, receiver, "NetworkServerPlayerDisconnected");
\`\`\`

## Conclusion
In conclusion, using Roslyn to generate code is a powerful way to create boilerplate code that you dont want to write yourself. It allows you to create code that is easy to read and understand while also being easy to maintain and became very useful if I ever needed to update the code and didnt want to break all games around it!

It is a bit of a pain to set up however once you have it set up it is very easy to use.

## Example files
Here is an example of the generated code that will be generated for the NetworkRPC attribute

Game code:
\`\`\`csharp
[NetworkRPC(MessageReliability.Unreliable, true)]
public void RpcSyncAnimToClient(AnimationInfo animationInfo)
{
}
\`\`\`

Generated code:
\`\`\`csharp
public partial class NetworkAnimatorBasic
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
\`\`\`

Here is an example of the generated code that will be generated for the NetworkMessage attribute

Game code:
\`\`\`csharp
[NetworkSerialize]
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
}
\`\`\`
Generated code:
\`\`\`csharp
public partial class NetworkMessage
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
\`\`\`
    `
  },
  "acorn2d": {
    title: "Building Acorn2D: Tools from a Custom Multiplayer Engine",
    date: "April 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-12.png",
    description: "Building a 2D game engine from scratch in C++.",
    content: `## Introduction
Acorn2D is a 2D Multiplayer Engine that a [friend](https://bennilsson.github.io/) and I have been working on for a while now. It is a custom engine that is built from the ground up.

It is a 2D engine that is built on top of [GLFW](https://www.glfw.org/) and [OpenGL](https://www.glfw.org/).

So why did we make this engine? Well, I wanted to learn how to make a game engine. I have always been interested in game engines and how they work. So we thought we would give it a go and see what we can learn.

## The projects
In Acorn there are three projects that are important to understand. The first is the **Engine** project, which contains the engine code. The second is the **TestGame** project, which contains the game code. The third is the **Acorn** project, which contains the editor.

The **Engine** project is a C++ project that contains the engine code (duh). It is a static library that is linked to the **TestGame** project that means that the engine code is compiled into the game executable.
<!-- The game  -->

## Tracey
Tracey is a C++ profiler that was amazing to set up. It is a header only library that is very easy to use. It has a very simple API and it is very fast.

The part that got me excited is that you can use it from the website if you have a saved profiling session meaning you can test it against older versions of your code to see if you made an improvement
[Link to tracey here](https://tracy.nereid.pl/)

I managed to use it to improve performance up to 2000fps along the way managed to pick up some awesome screnshots
<img src="assets/img/funny-0.png" class="img-responsive" alt="Tracey profiler showing extremely high frame time spikes in a humorous way">

<!-- aixlog -->
## Aixlog
Aixlog is a C++ logging library that is very easy to use. It has a very simple API and it is very fast.
\`\`\`cplusplus
Log::init(
{
	std::make_shared<SinkCout>(Severity::trace, "%H:%M.%S [#severity] [#file | Function: #function | Line: #line] #message"),
	std::make_unique<SinkFile>(Severity::trace, "latest.log", "%H:%M.%S [#severity] [#file | Function: #function | Line: #line] #message"),
	std::make_shared<SinkNative>(gameTitle, Severity::error)
});
\`\`\`

This is what the example looks like
\`\`\`cplusplus
22:10.36 [Info] [Game.cpp | Function: InitializeInternal | Line: 35] Logging Initialized.
22:10.36 [Info] [Game.cpp | Function: InitializeInternal | Line: 37] Engine Initializing.
22:10.36 [Info] [Renderer.cpp | Function: Initialize | Line: 33] Renderer Initialized.
22:11.42 [Warning] [SceneManager.cpp | Function: DestroyAllPendingGameObjects | Line: 296] GameObject is still referenced after being destroyed | 2 | class std::shared_ptr<class GameObject> | Ignore this unless there is loads of them.
\`\`\`

## Lua
So you might be going hold on a minute; why lua? and honestly it was something I just wanted to try out. I had used lua before however never implemented it into a game engine.


I used [sol2](https://github.com/ThePhD/sol2) which is a C++ to lua api to make it easier than writing raw lua api calls to make functions.

This is some of the example code that I used within the base addon that I had to spawn people and pick them up
\`\`\`lua
local function leftButtonUp()
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
end)
\`\`\`
This is a video of what the code does, there is more code however you get the idea.
<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/yAzBE10zwpk" title="Acorn2D Lua Scripting Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Protobufs
Protobufs are a way to serialize data in a way that is very fast and very small. It is a binary format that is very fast to read and write. It is also very small, which is great for network traffic.

It is a bit of a pain to set up however once you have it set up it is very easy to use. You just need to create a .proto file and then run the protoc compiler on it. It will generate C++ code that you can use to serialize and deserialize the data.
\`\`\`protobuf
syntax = "proto3";
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
}
\`\`\`

This is our base protobuf for the engine; this is how multiplayer works. At the moment it is very inspired by source engine and how that works so there are "ticks" and network messages

## Conclusion
So this is the architecture of Acorn2D. It is a very simple engine that is very easy to use. It is also very fast and very small. It is a great engine for 2D games and it is very easy to use.

Honestly I am very happy with how it has gone and will make more blogs on it in the future as there is some awesome stuff in here!`
  },
  "gmod": {
    title: "How Garry's Mod Kickstarted My Game Dev Journey",
    date: "March 2023",
    author: "Josh Mobley",
    headerImage: "assets/img/gmod_background.jpg",
    description: "My experience scripting in Garry's Mod.",
    content: `## The Beginning of a Journey
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
  },
  "mario": {
    title: "Mario: A Platformer Remake in SDL",
    date: "February 2023",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-1.jpg",
    description: "Recreating Mario platformer mechanics in SDL.",
    content: `## Introduction to the Mario Recreation Project
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
  },
  "mmo": {
    title: "Designing a Scalable MMO: My Final Year Project",
    date: "May 2025",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-9.jpg",
    description: "Building a multiplayer online game for my final year project.",
    content: `## Introduction
This project aims to create a massively multiplayer online game (MMO) framework that would allow me to develop a game that can be played by many players simultaneously. The framework is designed to be flexible and scalable, allowing for easy integration of new features and content.

I explored industry standards and best practices in game development, focusing on network architecture, server-client communication, and database management. The project also includes a prototype "game" that demonstrates the capabilities of the framework.

## Project Overview
The project is built using a combination of C# and Unity for the game client. The framework supports real-time multiplayer interactions, player authentication, and data persistence.

Key features of the framework include:

*   Player authentication and account management
*   Data persistence using a relational database
*   Modular architecture for easy feature integration
*   Protobufs for efficient data serialization

## Protobufs

Protobufs (Protocol Buffers) are used for efficient serialization of data. They allow for compact and fast data exchange between the server and client. The framework uses Protobufs to define the structure of messages exchanged during gameplay and even between services themselves

There were 3 worlds created, each with their own set of services that could be turned on at will and off. The worlds were:

*   World 1: DungeonTemplate
*   World 2: MainWorldTemplate
*   World 3: TownTemplate

## Worlds

Worlds were like "servers" in the sense that they could be created and destroyed at will. Each world had its own set of services that could be turned on and off at will. The worlds were:

*   Service 1: Login Service
*   Service 2: Game Service
*   Service 3: Chat System

Each service was its own process, meaning that they could be run on different machines or even in different data centers. This allows for scalability and flexibility in the architecture

MainWorldTemplate was used as a login world and so it only had use for the login service. The TownTemplate was used as a game world and so it had use for the game service and chat system. The DungeonTemplate was used as a dungeon world and so it had use for the game service and chat system.


Here is an example of the MainWorldTemplate class:
\`\`\`csharp
public class MainWorldTemplate : WorldData
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
}
\`\`\`

Services could speak to one and another meaning that the login service could speak to the game service and the chat system. This was done using Protobufs so that services could query each other for the state of the user

Here is an example of the Chat Service talking to the Game Service:
\`\`\`csharp
private static void AdminFlight(ServiceSocketClient socket, string[] args, int userId)
{
	var packet = InternalMessageTemplate.CreateInstance(
		MessageID.AdminFlight,
		new Recipients(RecipientType.SpecificServiceInWorld, null, ServiceType.Game), new PacketBase());
	
	socket.Send(packet);
}
\`\`\`

In this example, the chat service is sending a message to the game service. This allowed the user to fly however the chat service did not know what to do with that command so it sent it over to the game service which could handle permissions and so on.

## Conclusion
The project successfully demonstrates the capabilities of the MMO framework, showcasing its modular architecture and efficient data handling using Protobufs and allowing for services to talk to each other shows scalability while I am sure there would be bottlenecks it was great to get this working.

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
  },
  "01": {
    title: "Object Pooling in Multiplayer: Performance & Pitfalls",
    date: "October 2020",
    author: "Josh Mobley",
    headerImage: "assets/img/portfolio/portfolio-11.png",
    description: "The issues with using Object Pooling in a fully multiplayer game.",
    content: `## The Challenge
In my university Tower Defence game project, I faced the challenge of efficiently spawning large numbers of enemies and projectiles without causing performance drops. The solution was to implement an object pooling system that would reuse game objects instead of constantly creating and destroying them.

<div class="video-wrapper">
    <iframe src="https://www.youtube-nocookie.com/embed/-Bgl3AXwzYg?showinfo=0" title="Object Pooling Script Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
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
    <iframe src="https://www.youtube-nocookie.com/embed/POXiNS1v1dQ?showinfo=0" title="Object Pooling Performance Benefit Showcase" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Key Lessons
Through implementing this system, I learned valuable lessons about:

*   Memory management in game development
*   The importance of proper object state management
*   Performance optimization for real-time multiplayer games
*   Debugging complex object behavior in networked environments
</ul>`
  }
};
