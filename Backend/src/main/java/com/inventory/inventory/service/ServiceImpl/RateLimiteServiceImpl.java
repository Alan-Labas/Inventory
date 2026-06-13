package com.inventory.inventory.service.ServiceImpl;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.inventory.inventory.service.RateLimiteService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;



@Service
public class RateLimiteServiceImpl implements RateLimiteService {

    private final Cache<String, Bucket> cache = Caffeine.newBuilder().expireAfterAccess(Duration.ofHours(1)).maximumSize(1000).build();


     @Override
    public Bucket resolveLoginBucket(String ip) {
        return cache.get("login:" + ip, k -> newLoginBucket());
    }

    @Override
    public Bucket resolveRegisterBucket(String ip) {
        return cache.get("register:" + ip, k -> newRegisterBucket());
    }

    private Bucket newLoginBucket() {
        Bandwidth limit = Bandwidth.builder().capacity(10).refillGreedy(10, Duration.ofMinutes(1)).build();
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket newRegisterBucket(){
         Bandwidth limit = Bandwidth.builder().capacity(5).refillGreedy(5, Duration.ofHours(1)).build();
         return Bucket.builder().addLimit(limit).build();
    }
}
