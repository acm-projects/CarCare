package com.example.demo.inspections.dto;

public class RepairVideoDto {

    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String watchUrl;

    public RepairVideoDto() {}

    public RepairVideoDto(String videoId, String title, String description, String thumbnailUrl, String watchUrl) {
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.watchUrl = watchUrl;
    }

    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public String getWatchUrl() { return watchUrl; }
    public void setWatchUrl(String watchUrl) { this.watchUrl = watchUrl; }
}