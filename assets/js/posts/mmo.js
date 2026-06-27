window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["mmo"] = {
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
};

