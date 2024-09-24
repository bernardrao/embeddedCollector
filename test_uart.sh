#!/bin/bash


for (( i=0;i<100000;i++))
do   
   echo "$i abcdefg" > /dev/ttyS3

done
