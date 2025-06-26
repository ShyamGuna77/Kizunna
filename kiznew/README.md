i tried logginmg in 3 accounts and every account has samwe inbox and outbox messages even thiugh i sent them from one account and evryaccount showing logged in as margo even though i not plz fix this

I see the issue! The problem is that the chats page is always using the first member from the database as the "current user" instead of properly detecting which user you're logged in as. Let me fix this by implementing proper user session detection.
The issue is in the getCurrentUserMember() function - it's always returning the first member from the database. Let me fix this
