---
title: "{{ replace .Name "-" " " | title }}"
description: "Description of post"
date: {{ .Date }}
tags: []
image: "/posts/{{.Name}}/images/IMAGE_NAME.png"
type: post
---

![image alt text](/posts/{{.Name}}/images/header.png "Image title text")
