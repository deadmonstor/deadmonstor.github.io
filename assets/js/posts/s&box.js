window.BLOG_POSTS = window.BLOG_POSTS || {};
window.BLOG_POSTS["deltasnapshot"] = {
  title: "Optimizing Networked State Sync: A Look at s&box's DeltaSnapshot System",
  date: "June 2026",
  author: "Josh Mobley",
  headerImage: "assets/img/sbox.jpg",
  description: "Breaking down how s&box's engine syncs networked object state efficiently.",
content: `## Introduction

Over the last couple of weeks I have been taking a look at how s&box syncs networked object state, for those who don't know s&box is a game engine that is being developed by Facepunch Studios, the creators of Garry's Mod.

From a high level it seems easy, you just take a look at what has changed and send that over the network, however it is a lot more complicated than that.

// TODO: Talk about C#

## DeltaSnapshot

DeltaSnapshots are a way to efficiently sync networked object state by only sending the changes that have occurred since the last snapshot. This is done by keeping track of the previous state and comparing it to the current state, and only sending the differences, and even that is a simplification!

Rather than tracking one global last known state, s&box tracks state per connection. Every networked object's fields (referred to as slots) are hashed, and that hash is compared against what a specific client has already acknowledged. If the hash matches, the slot is skipped entirely for that client. This means two players can be sitting at completely different versions of the same object's state, and each one only ever receives what they're individually missing, rather than everyone getting the same broadcasted packet.

\`\`\`csharp
if ( receivedSnapshotStates.TryGetValue( snapshot.ObjectId, out var state ) )
{
	for ( var j = 0; j < snapshot.Entries.Count; j++ )
	{
		var entry = snapshot.Entries[j];
		var slot = entry.Slot;

		if ( entry.LocalState?.Connections?.Contains( connectionId ) ?? false )
		{
            // If the entry is already in the local state and has been acknowledged by this connection or in ACK timer, we can skip sending this slot to the client
			if ( state.TryGetHash( slot, out _, Time ) )
				continue;
		}

		var value = entry.Value;
		if ( state.TryGetHash( slot, out var oldHash, Time ) )
		{
			// If the hash matches, we can skip sending this slot to the client
			if ( entry.Hash == oldHash )
				continue;
		}

        // If we get here, it means the slot has changed and we need to send it to the client
		dataToSend ??= SnapshotData.Pool.Rent();
		dataToSend[slot] = value;
		state.AddPredicted( entry, Time );
		entry.Connections?.Add( connectionId );
	}
}
\`\`\`


## Exploit protection
Most of the client code that ends up on the 


## Retry storm
A retry storm happens when a client can't acknowledge a snapshot in time, so the server keeps re-sending the same snapshot over and over, causing a flood of network traffic. This can be triggered by the client lagging, or even by the server itself lagging.
It gets worse with larger snapshots. A bigger payload takes longer to serialize, but the acknowledgement timer doesn't care; it just keeps counting down. So the snapshot is more likely to time out before it's even fully sent, which triggers an automatic retry, which puts the same large snapshot back at the start of the same slow process. The loop feeds itself, and in the end the server crashes because it can't keep up with the flood of packets going in and out.

\`\`\`csharp
// This is the maximum time we will wait for an acknowledgement before we consider the snapshot to have failed and we will resend it. 
private const float MaximumAckResponseTime = 0.25f;

...

// This is the predicted data that we have sent to the client, but have not yet received an acknowledgement for. We will keep this data around for a short period of time in case the client does not acknowledge it in time, so we can resend it.
public void AddPredicted( in DeltaSnapshot.SnapshotDataEntry input, float timeNow )
{
	_predictedData[input.Slot] = new PredictedEntry( input.Value, timeNow + MaximumAckResponseTime, input.Hash );
}

...

public bool TryGetHash( int slot, out ulong hash, float timeNow )
{
	if ( _predictedData.TryGetValue( slot, out var predicted ) && timeNow <= predicted.ExpireTime )
	{
		hash = predicted.Hash;
		return true;
	}

	if ( Data.TryGetValue( slot, out var e ) )
	{
		hash = e.Hash;
		return true;
	}

	hash = 0;
	return false;
}
\`\`\`


# Investigation

Currently I'm investigating an issue with this system, so here's a quick rundown. If you've played Garry's Mod, you'll know you can "duplicate" the state of game objects and paste them down later to recreate builds. Right now this works by serializing the object to JSON on the client, then sending that JSON back to the server when you want to paste it down so it can be recreated there.

The problem is that serializing and deserializing that JSON can sometimes take longer than the 0.25f acknowledgement window on its own, and on top of that, the engine can freeze for a moment while it mounts cloud content. By the time it's finished, the delta system has already decided the prediction expired and re-sends the data, which kicks off the same slow process again, and you end up with a retry storm. This seems to be a bigger problem on linux/wine because of the emulation and it generally taking longer to do things in the engine.

I'm currently testing two possible fixes: scaling the acknowledgement timer per slot based on the user's ping and how loaded the server is, or packing the data tighter so serialization doesn't take long enough to trigger the problem in the first place.

## Looping problem (Scaling)

Currently every frame we are looping over all network objects to check if they have changed and need to be sent to the client. This is fine for a small number of objects, but as the number of networked objects increases, this becomes a problem. The loop takes longer and longer to complete. 

<img src="assets/img/blog/sbox_profile.png" alt="s&box profile" />

Image is of the profiler [https://superluminal.eu/](https://superluminal.eu/)

Before: <img src="assets/img/blog/sbox_before.png" alt="s&box before" />
After: <img src="assets/img/blog/sbox_after.png" alt="s&box after" />

Links:

s&box: [https://sbox.facepunch.com/](https://sbox.facepunch.com/)
Code: [https://github.com/Facepunch/sbox-public/](https://github.com/Facepunch/sbox-public/)
  
  `
};