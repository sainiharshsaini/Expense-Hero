import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { checkBudgetAlerts } from "@/lib/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({ // This is the core of how Inngest integrates with your Next.js API route.
    client: inngest, // This option tells the serve() function which Inngest client instance to use for interacting with the Inngest platform.
    functions: [ // This option is an array where you list all the Inngest functions that you want this specific Next.js API route to "serve." When Inngest sends an event to this API endpoint, it will look at the event.name and try to find a matching function in this array to execute.
        /* your functions will be passed here later! */
        checkBudgetAlerts
    ],
});
