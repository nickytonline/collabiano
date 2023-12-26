import type * as Party from "partykit/server";

export interface ChatMessage {
  user: string;
  text: string;
}

export default class Server implements Party.Server {
  // eslint-disable-next-line no-unused-vars
  constructor(readonly party: Party.Party) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    // eslint-disable-next-line no-console
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send(
      JSON.stringify({
        user: "server",
        text: "Let's get this party started",
      } as ChatMessage)
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(message, [
      // ...except for the connection it came from
      // sender.id,
    ]);
  }
}

Server satisfies Party.Worker;
