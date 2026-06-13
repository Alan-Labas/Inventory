package com.inventory.inventory.service;


import io.github.bucket4j.Bucket;
import org.springframework.stereotype.Service;


public interface RateLimiteService {
    Bucket resolveLoginBucket(String ip);
    Bucket resolveRegisterBucket(String ip);
}
