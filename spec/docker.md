# docker

```sh
docker build -t travelr-be . [--no-cache]
docker run --rm -it travelr-be /bin/sh
docker tag travelr-be asia.gcr.io/kubernetes-206923/travelr-be:1.0.0
gcloud docker -- push asia.gcr.io/kubernetes-206923/travelr-be:1.0.0
```
