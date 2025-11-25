# S3 PLAYER

The s3-player div abstracts a real media player and basically guards it with an additional play button to protect against accidentally incurred charges from s3 media file loading.

The demo does not load real s3 files, but in your own backend-generated html file you can populate the window.s3media object with expiring/signed s3 urls and include this s3-player js module.

Uploading could also be possible, and you'd need to plug into your own real endpoint that can give you back a temporary (expiring) signed upload url from s3.

## Run the demo

cli

```bash
python3 -m http.server -d ../../
```

browser

```
http://localhost:8000/examples/s3-player
```

