package com.example.demo;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoService service;

    public PhotoController(PhotoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Photo> list() {
        return service.listAll();
    }

    @GetMapping("/{id}")
    public Photo get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public Photo upload(@RequestParam("file") MultipartFile file,
                        @RequestParam(value = "name", required = false) String name,
                        @RequestParam(value = "description", required = false) String description)
            throws IOException {
        return service.upload(file, name, description);
    }

    @PutMapping("/{id}")
    public Photo update(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return service.update(id, body.get("name"), body.get("description"));
    }

    @DeleteMapping("/{id}")
    public Map<String, String> delete(@PathVariable Long id) {
        service.delete(id);
        return Map.of("message", "删除成功");
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> getFile(@PathVariable Long id) {
        Photo photo = service.getById(id);
        Resource resource = new FileSystemResource(service.getFilePath(id));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.getContentType()))
                .body(resource);
    }
}
