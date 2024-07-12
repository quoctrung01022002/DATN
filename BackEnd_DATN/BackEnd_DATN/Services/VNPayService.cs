using BackEnd_DATN.Helpers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Text;

namespace BackEnd_DATN.Services
{
    public interface IVNPayService
    {
        void AddRequestData(string key, string value);
        void AddResponseData(string key, string value);
        string GetResponseData(string key);
        string CreateRequestUrl(string baseUrl, string vnp_HashSecret);
        bool ValidateSignature(string receivedHash, string expectedKey);
    }

    public class VNPayService : IVNPayService
    {
        private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
        private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

        public void AddRequestData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _requestData[key] = value;
            }
        }

        public void AddResponseData(string key, string value)
        {
            if (!string.IsNullOrEmpty(value))
            {
                _responseData[key] = value;
            }
        }

        public string GetResponseData(string key)
        {
            return _responseData.TryGetValue(key, out string retValue) ? retValue : string.Empty;
        }

        public string CreateRequestUrl(string baseUrl, string vnp_HashSecret)
        {
            var data = new StringBuilder();

            foreach (var pair in _requestData)
            {
                if (!string.IsNullOrEmpty(pair.Value))
                {
                    data.Append(WebUtility.UrlEncode(pair.Key) + "=" + WebUtility.UrlEncode(pair.Value) + "&");
                }
            }

            string queryString = data.ToString();

            baseUrl += "?" + queryString;
            string signData = queryString;

            if (signData.Length > 0)
            {
                signData = signData.Remove(data.Length - 1, 1);
            }

            string vnp_SecureHash = Utils.HmacSHA512(vnp_HashSecret, signData);
            baseUrl += "vnp_SecureHash=" + vnp_SecureHash;

            return baseUrl;
        }

        public bool ValidateSignature(string receivedHash, string expectedKey)
        {
            string rspRaw = GetResponseData();
            string myChecksum = Utils.HmacSHA512(expectedKey, rspRaw);
            return myChecksum.Equals(receivedHash, StringComparison.InvariantCultureIgnoreCase);
        }

        private string GetResponseData()
        {
            var data = new StringBuilder();

            if (_responseData.ContainsKey("vnp_SecureHashType"))
            {
                _responseData.Remove("vnp_SecureHashType");
            }

            if (_responseData.ContainsKey("vnp_SecureHash"))
            {
                _responseData.Remove("vnp_SecureHash");
            }

            foreach (var kv in _responseData)
            {
                if (!string.IsNullOrEmpty(kv.Value))
                {
                    data.Append(WebUtility.UrlEncode(kv.Key) + "=" + WebUtility.UrlEncode(kv.Value) + "&");
                }
            }

            if (data.Length > 0)
            {
                data.Remove(data.Length - 1, 1);
            }

            return data.ToString();
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string x, string y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = CompareInfo.GetCompareInfo("en-US");
            return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
        }
    }
}
