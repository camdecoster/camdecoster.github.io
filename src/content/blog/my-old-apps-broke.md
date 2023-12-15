---
title: "My Old Apps Broke"
description: "An investigation in to why my frontend could no longer connect to my backend"
pubDate: 2022-02-20T07:53:32-07:00
tags: [devblog, heroku, vercel, zeit, ssl, postgres, sql]
image: "@assets/my-old-apps-broke/images/IMAGE_NAME.png"
---

![heroku logo modified to say hebroku](@assets/my-old-apps-broke/images/header.png "Broken Heroku = Hebroku")

While going through the Bloc curriculum (which became Thinkful then became Chegg, I think), I created two applications for assignements: [Expense Tracker](https://expense-tracker-client.vercel.app/) and [Quiz Builder](https://quiz-builder-client.vercel.app/). They both followed the same template: React single page application deployed to Vercel that connects to Express API and PostgreSQL database hosted on Heroku. Neither of these apps will win awards, but I did learn a lot by creating them. In the process of creating this blog and generally updating my online presence, I discovered that they stopped working. I still reference these on my [portfolio](https://camdecoster.github.io/portfolio/), so it wasn't a good look. That was in October. I checked again this week, and, unfortunately, no one else solved this problem for me while I was ignoring it. So I did this weekend!

My first hope was that some quick googling would show me the answer on Stack Overflow or a similar site, but no luck. The only feedback that I was getting was a 500 response code with the very unhelpful 'Internal server error' message (thanks past Cam!). At least I could tell that it was the backend. I fired up Postman and started playing around with the payload to see if I could get any other information from the Quiz Builder API. Leaving out some of the required parameters resulted in an error message stating that I was missing information. So the API was working to some degree.

The next step was to check the Heroku logs. Here's what I found:

```
2022-02-19T15:13:29.688089+00:00 heroku[router]: at=info method=OPTIONS path="/api/auth/login" host=quiz-builder-cdd.herokuapp.com request_id=52f8134e-41d3-40fa-ab8b-7dcffb4efdae fwd="67.165.216.59" dyno=web.1 connect=0ms service=2ms status=204 bytes=580 protocol=https
2022-02-19T15:13:29.785404+00:00 heroku[router]: at=info method=POST path="/api/auth/login" host=quiz-builder-cdd.herokuapp.com request_id=d99c4a01-9b31-4aa7-a1c4-13958ec4ad01 fwd="67.165.216.59" dyno=web.1 connect=0ms service=8ms status=500 bytes=588 protocol=https
```

Again, there wasn't much to go on. Just another reference to the 500 status. This application is on the hobby tier (aka. free), so not much log information is surfaced. There's an add-on for Heroku instances called [Logentries](https://logentries.com/) that can make a bit more information available, but that still just mentioned the 500 status.

If Heroku wasn't going to show me any info about this error, I would have to make my app do it. After all, the API was at least partially working. Looking at the API code, I saw that this was where Express was returning the 500 status:

```javascript
app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === "production") {
        response = { error: { message: "Internal server error" } };
    } else {
        console.error(error);
        response = {
            error: { message: "Internal server error", error },
        };
    }
	
    res.status(500).json(response);
});
```

By design, the production implementation didn't return the error information. But I needed that error, so I made a temporary change:

```javascript
app.use((error, req, res, next) => {
	const response = {
		error: { message: "Internal server error", error },
	};
	
    res.status(500).json(response);
});
```

After deploying the update and trying to log in again, I could now see the issue in the server response:

```
{
	name: 'error',
	length: 165,
	severity: 'FATAL',
	code: '28000',
	detail: undefined,
	hint: undefined,
	position: undefined,
	internalPosition: undefined,
	internalQuery: undefined,
	where: undefined,
	schema: undefined,
	table: undefined,
	column: undefined,
	dataType: undefined,
	constraint: undefined,
	file: 'auth.c',
	line: '502',
	routine: 'ClientAuthentication'
}
```

And from checking Logentries, the error is even more specific (secrets redacted):

```
error: no pg_hba.conf entry for host "▮▮.▮▮.▮▮.▮▮", user "▮▮▮▮▮▮▮▮", database "▮▮▮▮▮▮▮▮", SSL off
```

There was some kind of SSL issue with the database. Searching around, I found this [announcement](https://devcenter.heroku.com/changelog-items/2035) from Heroku:

> Beginning today, we will be rolling out changes to the platform that **will enforce SSL for all Heroku Postgres client connections**, including ephemeral add-ons like those used for CI/CD workflows. We recommend you evaluate your application setup, especially those that may have been implicitly relying on insecure connectivity between Common Runtime and hobby tier databases.

Somehow, I missed all of the notices that this would be taking place. My applications relied on 'insecure connectivity between Common Runtime and hobby tier databases', so they broke. I just wanted to get my apps running again without having to implement a more secure solution (which I deemed unnecessary for these projects). Thankfully, there's an easy way to work around this issue.

The API's both use **knex** to interact with the database. When setting up a connection to a database with knex, unauthorized connections are rejected by default. Since Heroku was forcing SSL to be used for connections, the connection being set up in these applications was not being authorized and was therefore being rejected. But defaults can be changed, so that's what I did.

The connection config changed from this:

```javascript
const db = knex({
    client: "pg",
    connection: DATABASE_URL
});
```

To this:

```javascript
const db = knex({
    client: "pg",
    connection: {
		connectionString: DATABASE_URL,
		ssl: { rejectUnauthorized: false }
	}
});
```

(h/t to [SO](https://stackoverflow.com/a/61125814))

With this update, Quiz Builder started working once again. It's not the best solution, but it fixed one of my portfolio apps.

Unfortunately, Expense Tracker was still having an unrelated issue. When I first deployed it, Vercel was still Zeit and served apps from a different domain. In this case, that was https://expense-tracker-client.now.sh. But now Expense Tracker is being served from https://expense-tracker-client.vercel.app. I had previously set up Heroku to expect a CLIENT_ORIGIN header of the now.sh domain. Since this value was now coming from the vercel.app domain, I was getting a CORS error. This is easy to change in Heroku. Just go to your app settings page and edit the 'Config Vars' to update the CLIENT_ORIGIN value. Now both apps were working again.

I haven't looked at any of the apps I built in bootcamp since I got them working in the first place (around July of 2020). It was strange to go back through the code I had written with some professional experience. There are parts that I would build differently, but plenty that I feel were built well. There are also parts that I don't remember. Honestly, it made me feel a bit rusty to diagnose this database issue. That's just not something that I deal with in my day job. This reminds me of when I was studying to take the Professional Engineer exam in my past career. There was so much that I had forgotten and I was worried that I would fail miserably. But then I realized something that helped me calm down and succeed: if I learned this once, I can learn it again. After all, an engineer is a problem solver.