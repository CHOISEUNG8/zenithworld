from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'name', 'phone', 'birth_date', 'gender', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
            'confirm_password': {'write_only': True},
        }
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("이미 사용 중인 아이디입니다.")
        return value
    
    def validate_password(self, value):
        import re
        special = r"!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?"
        if len(value) < 4 or len(value) > 20:
            raise serializers.ValidationError("비밀번호는 4자 이상 20자 이하여야 합니다.")
        if not re.match(r'^[a-zA-Z0-9' + special + r']{4,20}$', value):
            raise serializers.ValidationError("비밀번호는 영문, 숫자, 특수문자만 사용할 수 있습니다.")
        if re.match(r'^[' + special + r']{4,20}$', value):
            raise serializers.ValidationError("비밀번호는 특수문자만으로 구성할 수 없습니다.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("비밀번호가 일치하지 않습니다.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('아이디 또는 비밀번호가 올바르지 않습니다.')
            if not user.is_active:
                raise serializers.ValidationError('비활성화된 계정입니다.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('아이디와 비밀번호를 모두 입력해주세요.')

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'name', 'phone', 'birth_date', 'gender', 'created_at', 'updated_at')
        read_only_fields = ('id', 'username', 'created_at', 'updated_at')