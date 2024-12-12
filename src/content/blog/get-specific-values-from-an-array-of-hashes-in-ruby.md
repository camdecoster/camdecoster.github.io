---
title: "Get specific values from an array of hashes in Ruby"
description: "Grab only the key value pairs you need"
pubDate: 2024-08-31T17:13:32.424Z
tags: [devblog, quick-tip, ruby]
image: "@assets/images/quick_tip_header.png"
---

![quick tip header](@assets/images/quick_tip_header.png "Quick Tip")

Let's say you have an array of hashes like this in Ruby:
```ruby
books = [
  { title: "Book 1", length: 400, genre: "Fiction" },
  { title: "Book 2", length: 300, genre: "Non-fiction"},
  { title: "Book 3", length: 425, genre: "Sci-Fi"}
]
```

How can you get all of the titles? Let's use the [`map`](https://ruby-doc.org/core/Array.html#method-i-map) method:

```ruby
books.map { |b| b[:title] }
# ["Book 1", "Book 2", "Book 3"]
```

What about if you want the length too?

```ruby
books.map { |b| [b[:title], b[:length]] }
# [["Book 1", 400], ["Book 2", 300], ["Book 3", 425]]
```

But what if you want to include the keys?

```ruby
books.map { |b| { title: b[:title], length: b[:length] } }
# [{:title=>"Book 1", :length=>400}, {:title=>"Book 2", :length=>300}, {:title=>"Book 3", :length=>425}]
```

There's a cleaner way to do that same operation using the Hash [`slice`](https://ruby-doc.org/core/Hash.html#method-i-slice) method:

```ruby
books.map { |b| b.slice(:title, :length) }
# [{:title=>"Book 1", :length=>400}, {:title=>"Book 2", :length=>300}, {:title=>"Book 3", :length=>425}]
```

If you're using Rails with an **ActiveRecord** relation (instead of an array of hashes), you can use the [`select`](https://guides.rubyonrails.org/active_record_querying.html#selecting-specific-fields) method to simplify it further:

```ruby
books.select(:title, :length)
# [{:title=>"Book 1", :length=>400}, {:title=>"Book 2", :length=>300}, {:title=>"Book 3", :length=>425}]
```

☝️ This is a bit different since you're choosing columns with `select{:ruby}`, but the result is the same.