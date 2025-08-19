#!/usr/bin/bash

# Connect to the clickhouse server
ssh -L 9000:localhost:9000 admin@clickhouse