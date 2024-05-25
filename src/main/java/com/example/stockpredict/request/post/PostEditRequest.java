package com.example.stockpredict.request.post;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class PostEditRequest {

    @NotBlank(message = "제목 필수")
    private String title;

    @NotBlank(message = "내용 필수")
    private String content;

    @NotNull(message = "카테고리 필수")
    @Min(value = 0, message = "category 값은 0 이상")
    private Integer category;

    @Min(value = 0, message = "isImportant 값은 0 이상")
    private Integer isImportant;

    /*likes 필드 : 사용자가 직접 수정 X*/

    /*reports 필드 : 사용자가 직접 수정 X*/

    @Max(value = 1, message = "isSecret 값은 0 or 1")
    @Min(value = 0, message = "isSecret 값은 0 or 1")
    private Integer isSecret;

    /*
    * createdAt 필드 : 수정할 이유 X
    * updateDate 필드 : 사용자가 직접 수정 X
    * */

}
